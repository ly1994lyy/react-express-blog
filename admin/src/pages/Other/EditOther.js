import React, { useState, useEffect } from "react";
import { Form, Button, message } from "antd";
import { createOther, getOtherById, putOther } from "../../api/other";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function EditOther(props) {
  const [editorState, setEditorState] = useState(null);
  useEffect(() => {
    if (props.match.params.id) {
      getOtherById(props.match.params.id).then((res) => {
        setEditorState(BraftEditor.createEditorState(res.data.body));
      });
    }
  }, []);

  //富文本媒体上传设置
  const myUploadFn = (param) => {
    const serverURL = "http://localhost:4000/admin/api/upload";
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: JSON.parse(xhr.responseText).url,
        meta: {
          id: 'img' + Math.random()*10,
          title: "上传文件",
          alt: "上传文件",
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: "http://xxx/xx.png", // 指定视频播放器的封面
        },
      });
    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: "unable to upload.",
      });
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append("file", param.file);
    xhr.open("POST", serverURL, true);
    xhr.send(fd);
  };

  const onFinish = async (values) => {
    values.body = editorState.toHTML();
    if (props.match.params.id) {
      await putOther(props.match.params.id, { ...values });
      message.success("修改成功！");
    } else {
      await createOther({ ...values });
      message.success("添加成功！");
    }
    props.history.push("/admin/other");
  };

  const onFinishFailed = (errorInfo) => {
    message.error("请检查填写项");
    console.log("Failed:", errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const handleEditorChange = (e) => {
    setEditorState(e);
  };
  return (
    <Form
      {...layout}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="内容"
        rules={[{ required: true, message: "请填写内容" }]}
      >
        <BraftEditor
          value={editorState}
          onChange={handleEditorChange}
          style={{ border: "1px solid #e5c6c6" }}
          media={{ uploadFn: myUploadFn }}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EditOther
