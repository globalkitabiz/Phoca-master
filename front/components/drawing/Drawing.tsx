import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import CanvasComp from "./Canvas";
import Modal from "@modal/Modal";
import Result from "./Result";
import {
  DrawingContainer,
  Question,
  CanvasContainer,
  SubmitBtnContainer,
  SubmitBtn,
  ResetBtnContainer,
  ResetBtn,
} from "./Drawing.style";

interface DrawingWord {
  id: number;
  wordEng: string;
  wordKor: string;
}

interface DrawingResult {
  predicted: string;
  answer: string;
  result: boolean;
}

// dataUri에서 base64 부분만 추출
const getBase64FromDataUri = (dataURI: string): string => {
  return dataURI.split(",")[1];
};

// 그림 문제 받아오기
const getDrawingWord = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/quiz`);
  const result: DrawingWord = await res.json();
  return result;
};

// Backend API로 그림 판정 요청 (Replicate AI 사용)
const checkDrawing = async (data: { image: string; answer: string }): Promise<DrawingResult> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/quiz/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: DrawingResult = await res.json();
  return result;
};

function Drawing() {
  const router = useRouter();
  const url = router.pathname;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedWord, setSelectedWord] = useState<DrawingWord | undefined>(
    undefined,
  );
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const { data } = useQuery("drawing-word", getDrawingWord, {
    enabled: selectedWord === undefined,
  });

  const drawingMutation = useMutation(checkDrawing, {
    onSuccess: (data, variables) => {
      setResultModalOpen(true);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const submitBtnClickHandler = () => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const dataUri = canvas.toDataURL();
    const base64Image = getBase64FromDataUri(dataUri);

    // Backend API로 JSON 형태로 전송
    drawingMutation.mutate({
      image: base64Image,
      answer: selectedWord?.wordEng as string,
    });
  };

  const resetCanvas = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.getContext("2d")!!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const modalCloseHandler = () => {
    setResultModalOpen(false);
  };

  useEffect(() => {
    setSelectedWord(data);
  }, [data]);

  return (
    <>
      <DrawingContainer>
        <Question>{data && data.wordEng}</Question>
        <ResetBtnContainer>
          <ResetBtn onClick={resetCanvas}>모두 지우기</ResetBtn>
        </ResetBtnContainer>

        <CanvasContainer>
          <CanvasComp canvasRef={canvasRef} />
        </CanvasContainer>

        <SubmitBtnContainer>
          <SubmitBtn onClick={submitBtnClickHandler}>제출하기</SubmitBtn>
        </SubmitBtnContainer>
      </DrawingContainer>

      {resultModalOpen && (
        <Modal
          open={resultModalOpen}
          width="500px"
          large={true}
          url={url}
          onClose={modalCloseHandler}>
          <Result
            result={drawingMutation.data?.result ?? false}
            engWord={selectedWord?.wordEng}
            korWord={selectedWord?.wordKor}
            predicted={drawingMutation.data?.predicted ?? ""}
            onClose={modalCloseHandler}
          />
        </Modal>
      )}
    </>
  );
}

export default Drawing;
