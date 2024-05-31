import {useParams} from "react-router-dom";
import {useGetArticleQuery} from "../../services/serverApi";
import {Spin} from "antd";
import dayjs from "dayjs";

export default function ArticlePage() {
    const {id} = useParams<{id: any}>()
    const { data: article, isFetching, isLoading } = useGetArticleQuery(id)

    if (isLoading) return <Spin size={"large"} />
    if (!article) return <div>Статья не найдена</div>

    return (
        <>
            <h1>{article.title} {isFetching ? <Spin /> : ''}</h1>
            <div><i>{dayjs(article.created_at).format('DD.MM.YYYY HH:mm')}</i></div>

            <div>
                {article.description?.split("\n").map(function(paragraph, i) {
                    return (<p key={`description_p_${i}`}>{paragraph}</p>)
                })}
            </div>
        </>
    );
}
