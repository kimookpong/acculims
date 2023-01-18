import { React, useEffect, useState } from "react";
import {
  Card,
  Table,
  Layout,
  Col,
  Row,
  Button,
  Radio,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Spin,
} from "antd";
import {
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import "./LabReq.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD HH:mm";
const currDate = dayjs();
const beforeDate = currDate.subtract(5, "month");

function LabReq() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [statusList, setStatusList] = useState("All");
  const [dataCount, setDataCount] = useState({
    All: 0,
    Pending: 0,
    Received: 0,
    Reject: 0,
  });
  const [detail, setDetail] = useState([]);

  const [sStartDate, setSStartDate] = useState(beforeDate.format(dateFormat));
  const [sEndDate, setSEndDate] = useState(currDate.format(dateFormat));
  const [sType, setSType] = useState(1);
  const [sInput, setSInput] = useState(null);
  const [sWork, setSWork] = useState(1);
  const [sWorkType, setSWorkType] = useState(1);
  const [sDepart, setSDepart] = useState("ALL");
  const [sAddress, setSAddress] = useState(null);

  const setStatusListonClick = (id) => {
    setStatusList(id);
    // console.log(filteredData);
    //setData(filteredData);
  };

  const inputSType = (event) => {
    setSType(event.target.value);
  };
  const inputSInput = (event) => {
    setSInput(event.target.value);
  };
  const inputSDateRange = (event) => {
    setSStartDate(dayjs(event[0]).format(dateFormat));
    setSEndDate(dayjs(event[1]).format(dateFormat));
  };
  const inputSWork = (event) => {
    setSWork(event.target.value);
  };
  const inputSWorkType = (value) => {
    setSWorkType(value);
  };
  const inputSDepart = (event) => {
    setSDepart(event.target.value);
  };
  const inputSAddress = (event) => {
    setSAddress(event.target.value);
  };

  useEffect(() => {
    loadData();
  }, [
    sStartDate,
    sEndDate,
    sType,
    sInput,
    sWork,
    sWorkType,
    sDepart,
    sAddress,
  ]);

  const loadDetail = async (dataDetail) => {
    console.log(dataDetail);
    // return await axios.get(`http://localhost:3002/lab_order_detail?id=${dataDetail.order_number}`)
    //   .then(function (response) {setData(response.data)})
    //   .catch(function (error) {console.log(error)})
    //   .finally(function () {});
  };
  const loadData = async () => {
    setLoading(true);
    const filter = {
      date_start: sStartDate,
      date_stop: sEndDate,
      department: sDepart,
      address: sAddress,
      type: sType,
      text: sInput,
      work: sWork,
    };
    return await axios
      .post("http://localhost:3001/lab_order", filter)
      .then(function (response) {
        let dataArray = response.data;

        let count = {
          All: 0,
          Pending: 0,
          Received: 0,
          Reject: 0,
        };

        dataArray.forEach((d) => {
          if (d["h_status"] === "Pending") {
            count["Pending"] += 1;
          } else if (d["h_status"] === "Received") {
            count["Received"] += 1;
          } else if (d["h_status"] === "Reject") {
            count["Reject"] += 1;
          }
          count["All"] += 1;
        });
        setDataCount(count);
        setData(dataArray);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  };
  //loadData();
  const columns = [
    {
      title: "เลขที่สั่ง",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Status",
      dataIndex: "h_status",
      key: "h_status",
    },
    {
      title: "HN",
      dataIndex: "HN",
      key: "HN",
    },
    {
      title: "ชื่อผู้ป่วย",
      dataIndex: "patient_name",
      key: "patient_name",
    },
    {
      title: "ชื่อใบสั่ง",
      dataIndex: "form_name",
      key: "form_name",
    },
    {
      title: "ความเร่งด่วน",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "วันเวลาที่สั่ง",
      dataIndex: "order_date_time",
      key: "order_date_time",
    },
    {
      title: "วันเวลาที่รับ",
      dataIndex: "time_receive_report",
      key: "time_receive_report",
    },
    {
      title: "ห้องที่ส่งตรวจ",
      dataIndex: "department",
      key: "department",
    },
  ];
  const [labDisable, setLabDisable] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    if (newSelectedRowKeys.length > 0) {
      setLabDisable(false);
    } else {
      setLabDisable(true);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  return (
    <Layout>
      <Content>
        <Row>
          <Col span={18}>
            <Content>
              <Row>
                <Col span={4} className="iconMenu">
                  <h1>ใบรับ LAB</h1>
                </Col>
                <Col span={20}>
                  <Card>
                    <Row gutter={24}>
                      <Col span={10} style={{}}>
                        <Form.Item>
                          <RangePicker
                            showTime={{
                              format: "HH:mm",
                            }}
                            value={[
                              dayjs(sStartDate, dateFormat),
                              dayjs(sEndDate, dateFormat),
                            ]}
                            format={dateFormat}
                            onChange={inputSDateRange}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item>
                          <Radio.Group onChange={inputSType} value={sType}>
                            <Radio value={1}>Barcode</Radio>
                            <Radio value={2}>HN</Radio>
                            <Radio value={3}>ชื่อ-สกุล</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item label=":">
                          <Input onChange={inputSInput} value={sInput} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col>
                        <Form.Item>
                          <Radio.Group onChange={inputSWork} value={sWork}>
                            <Radio value={1}>งาน</Radio>
                            <Radio value={2}>Lab form</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item>
                          <Select
                            onChange={inputSWorkType}
                            value={sWorkType}
                            style={{
                              width: 120,
                            }}
                            options={[
                              {
                                value: 1,
                                label: "ALL",
                              },
                              {
                                value: 2,
                                label: "Lucy",
                              },
                              {
                                value: 3,
                                disabled: true,
                                label: "Disabled",
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item>
                          <Radio.Group onChange={inputSDepart} value={sDepart}>
                            <Radio value={"ALL"}>ALL</Radio>
                            <Radio value={"OPD"}>OPD</Radio>
                            <Radio value={"IPD"}>IPD</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item label="ที่อยู่ :">
                          <Input onChange={inputSAddress} value={sAddress} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <Row>
                    <Col span={6}>
                      <Button
                        onClick={() => setStatusListonClick("All")}
                        type={statusList === "All" ? "primary" : "default"}
                        block
                      >
                        All({dataCount["All"]})
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        onClick={() => setStatusListonClick("Pending")}
                        type={statusList === "Pending" ? "primary" : "default"}
                        block
                      >
                        Pending({dataCount["Pending"]})
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        onClick={() => setStatusListonClick("Received")}
                        type={statusList === "Received" ? "primary" : "default"}
                        block
                      >
                        Received({dataCount["Received"]})
                      </Button>
                    </Col>
                    <Col span={6}>
                      <Button
                        onClick={() => setStatusListonClick("Reject")}
                        type={statusList === "Reject" ? "primary" : "default"}
                        block
                      >
                        Reject({dataCount["Reject"]})
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Checkbox>Separate Tupe (FBS)</Checkbox>
                </Col>
              </Row>
            </Content>
            <Content>
              <Spin spinning={loading} tip="กำลังโหลดข้อมูล" size="large">
                <Table
                  // loading={{ indicator: <div>loading...</div> }}
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={data.filter((d) => {
                    if (statusList === "All") {
                      return d;
                    } else if (statusList === d["h_status"]) {
                      return d;
                    }
                  })}
                  rowKey={"order_number"}
                  size="small"
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        loadDetail(record);
                      }, // click row
                    };
                  }}
                />
              </Spin>
            </Content>
            <Row>
              <Col span={24}>
                <Card>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "inline-flex" }}>
                      <div style={{ padding: 5 }}>
                        <Button
                          style={{
                            padding: 10,
                            cursor: "pointer",
                            height: "auto",
                            minWidth: 100,
                          }}
                          disabled={labDisable}
                        >
                          <div>
                            <CheckCircleOutlined
                              style={{
                                fontSize: 40,
                              }}
                            />
                          </div>
                          <div>รับใบ LAB</div>
                        </Button>
                      </div>
                      <div style={{ padding: 5 }}>
                        <Button
                          style={{
                            padding: 10,
                            cursor: "pointer",
                            height: "auto",
                            minWidth: 100,
                          }}
                          disabled={labDisable}
                        >
                          <div>
                            <StopOutlined
                              style={{
                                fontSize: 40,
                              }}
                            />
                          </div>
                          <div>ปฎิเสธ</div>
                        </Button>
                      </div>
                      <div style={{ padding: 5 }}>
                        <Button
                          danger
                          style={{
                            padding: 10,
                            cursor: "pointer",
                            height: "auto",
                            minWidth: 100,
                          }}
                          disabled={labDisable}
                        >
                          <div>
                            <DeleteOutlined
                              style={{
                                fontSize: 40,
                              }}
                            />
                          </div>
                          <div>ลบ</div>
                        </Button>
                      </div>
                      <div style={{ padding: 5 }}>
                        <Button
                          style={{
                            padding: 10,
                            cursor: "pointer",
                            height: "auto",
                            minWidth: 100,
                          }}
                          disabled={labDisable}
                        >
                          <div>
                            <PrinterOutlined
                              style={{
                                fontSize: 40,
                              }}
                            />
                          </div>
                          <div>พิมพ์ Barcode</div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Content>
              <Card title="รายละเอียด Lab Order">
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
              <Card title="Lab Note"></Card>
              <Card title="ประเภทสิ่งส่งตรวจ">
                <p>1. โลหิต</p>
              </Card>
            </Content>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default LabReq;
