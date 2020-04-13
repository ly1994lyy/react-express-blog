import React, { useState, useEffect } from "react";
import { Tag, Card } from "antd";
import { LikeFilled } from "@ant-design/icons";
import { getCateById } from "../../api/category";
import { dayGet } from "../../utils/day";

function CategoryList(props) {
  const [artList, setArtList] = useState([]);
  const [title, setTitle] = useState("");
  useEffect(() => {
    getCateById(props.match.params.id).then((res) => {
      setArtList(res.data.articlelist);
      setTitle("分类:" + res.data.name);
    });
  }, []);
  return (
    <div>
      <Card
        title={title}
        xs={{ marginTop: 0 }}
        style={{ width: "100%", marginTop: 16 }}
      >
        {artList.map((item) => {
          return (
            <Card key={item._id} bordered={false}>
              <h2 className="tx-c">{item.title}</h2>
              <p className="tx-c fz-6">
                <Tag color="#108ee9">创建:{dayGet(item.createdAt)}</Tag>
                &nbsp;
                <Tag color="#87d068">更新:{dayGet(item.updatedAt)}</Tag>
                &nbsp;
                <Tag color="#f50" icon={<LikeFilled />}>
                  {item.likes.length}
                </Tag>
              </p>
              <p
                className="blogBody"
                dangerouslySetInnerHTML={{ __html: item.body }}
              ></p>
              <div className="tx-c">
                <button
                  className="txBtn"
                  onClick={() => props.history.push(`/article/${item._id}`)}
                >
                  阅读全文
                </button>
              </div>
            </Card>
          );
        })}
      </Card>
    </div>
  );
}

export default CategoryList;
