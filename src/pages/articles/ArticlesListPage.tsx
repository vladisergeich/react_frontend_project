import {List} from 'antd';
import {Link} from "react-router-dom";
import {useGetArticlesQuery} from "../../services/serverApi";

export default function ArticlesListPage() {
    const {data: articles, isLoading, isFetching} = useGetArticlesQuery()

    return (
        <>
            <h1>Статьи</h1>

            <p><Link to={'/articles/create'}>Создать новую статью...</Link></p>

            <List
                itemLayout="horizontal"
                bordered={true}
                dataSource={articles}
                rowKey={'id'}
                loading={isLoading || isFetching}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<Link to={`/articles/${item.id}`}>{item.title}</Link>}
                            description={item.short_desc}
                        />
                    </List.Item>
                )}
            />
        </>
    );
}
