import { React, useState } from "react";
import {
  Row,
  Col,
  Checkbox,
  Divider,
  Input,
  Form,
  TimePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;
const CancelComponent = (props) => {
  const [reasonOther, setReasonOther] = useState(null);
  const inputReasonOther = (event) => {
    setReasonOther(event.target.value);
  };
  const { data } = props;
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <>
      <Row>
        <Col span={4}>เลขที่สั่ง : {data[0]["order_number"]}</Col>
        <Col span={5}>HN : {data[0]["HN"]}</Col>
        <Col span={9}>ชื่อ-สกุล : {data[0]["patient_name"]}</Col>
        <Col span={6}>LAB : {data[0]["form_name"]}</Col>
      </Row>
      <Divider orientation="left">เหตุที่ต้อง Reject</Divider>
      <Checkbox.Group
        style={{
          width: "100%",
        }}
        onChange={onChange}
      >
        <Row
          style={{
            width: "100%",
          }}
        >
          <Col span={12}>
            <Checkbox value="ไม่มีรายการตรวจทาง LAN">
              ไม่มีรายการตรวจทาง LAN
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="Hemolysis">Hemolysis</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="เจาะเลือดไม่ถูกชนิดกับรายการตรวจ">
              เจาะเลือดไม่ถูกชนิดกับรายการตรวจ
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="เลือด Clotted (CBC,FBS)">
              เลือด Clotted (CBC,FBS)
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ชื่อในใบกับหลอดเลือดไม่ตรงกัน">
              ชื่อในใบกับหลอดเลือดไม่ตรงกัน
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ไม่มีใบนำส่ง">ไม่มีใบนำส่ง</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ปิดฝาหลอดเลือดสลับกัน">
              ปิดฝาหลอดเลือดสลับกัน
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ไม่มี Sample">ไม่มี Sample</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ไม่มีฉลากติด">ไม่มีฉลากติด</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ส่ง LAN ผิด">ส่ง LAN ผิด</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="E">
              <Input
                placeholder="อื่นๆ ระบุ"
                onChange={inputReasonOther}
                value={reasonOther}
              />
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="ปริมาณ Sample ไม่ถูกต้อง">
              ปริมาณ Sample ไม่ถูกต้อง
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
      <hr />
      <Form layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item label="แนวทางการแก้ปัญหา">
              <TextArea
                rows={4}
                style={{
                  resize: "none",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="เวลาแจ้ง">
              <TimePicker
                onChange={onChange}
                defaultOpenValue={dayjs("00:00", "HH:mm")}
                format="HH:mm"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ผู้ตวจสอบ/ผู้แจ้ง">
              <Select
                showSearch
                style={{ width: 200 }}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ผู้รับแจ้ง">
              <Select
                showSearch
                style={{ width: 200 }}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CancelComponent;
