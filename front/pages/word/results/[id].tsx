import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { WORD_NOTE_WIDTH, WORD_NOTE_HEIGHT } from "@utils/constant";
import Seo from "@common/Seo";
import Note from "@note/Note";
import Results from "@wordComp/results/Results";

const ResultPage: NextPage = () => {
  const router = useRouter();
  const wordId = router.query.id;

  const { data, isLoading } = useQuery(
    ["wordInfo", wordId],
    () => getWord(wordId),
    {
      enabled: !!wordId,
    }
  );

  if (!wordId || isLoading) {
    return (
      <>
        <Seo title="단어장 만들기" />
        <Note width={WORD_NOTE_WIDTH} height={WORD_NOTE_HEIGHT}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            로딩 중...
          </div>
        </Note>
      </>
    );
  }

  return (
    <>
      <Seo title="단어장 만들기" />
      <Note width={WORD_NOTE_WIDTH} height={WORD_NOTE_HEIGHT}>
        <Results wordInfo={data} />
      </Note>
    </>
  );
};

const getWord = async (wordId: string | string[] | undefined) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/word/${wordId}`,
  );
  const result = await res.json();
  return result;
};

export default ResultPage;
