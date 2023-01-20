import Barcode from "react-barcode";
import { React } from "react";
import { Col, Row } from "antd";

const BarcodeDetail = (props) => {
  const { element } = props;
  console.log(element);
  return (
    <Row
      style={{
        width: 566,
        height: 189,
        margin: "auto",
        border: "1px solid #ccc",
      }}
    >
      <Col span={24} style={{ fontSize: 24 }}>
        {element["order_date_time"]} {element["patient_name"]}
      </Col>
      <Col span={14}>
        <Barcode value={element["barcode"]} width={3} />
      </Col>
      <Col span={10} style={{ fontSize: 24 }}>
        {element["order_number"]}
      </Col>
    </Row>
  );
};

export default BarcodeDetail;
