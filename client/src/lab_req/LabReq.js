import { React, useEffect, useState } from "react";
import thTH from "antd/locale/th_TH";
import {
  ConfigProvider,
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

dayjs.locale(thTH);
const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD HH:mm";
const currDate = dayjs();
const beforeDate = currDate.subtract(5, "month");

function LabReq() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [statusList, setStatusList] = useState("All");
  const [dataCount, setDataCount] = useState({
    All: 0,
    Pending: 0,
    Received: 0,
    Reject: 0,
  });
  const [detail, setDetail] = useState(null);
  const [detailNote, setDetailNote] = useState(null);
  const [detailThing, setDetailThing] = useState(null);

  const [sStartDate, setSStartDate] = useState(beforeDate.format(dateFormat));
  const [sEndDate, setSEndDate] = useState(currDate.format(dateFormat));
  const [sType, setSType] = useState(1);
  const [sInput, setSInput] = useState(null);
  const [sWork, setSWork] = useState(1);
  const [sWorkType, setSWorkType] = useState("All");
  const [sWorkTypeList, setSWorkTypeList] = useState([]);
  const [sDepart, setSDepart] = useState("ALL");
  const [sAddress, setSAddress] = useState(null);

  const getWorkTypeList = (id) => {
    if (id === 1) {
      return axios
        .get("http://localhost:3001/lab_form_head")
        .then(function (response) {
          setSWorkTypeList(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (id === 2) {
      return axios
        .get("http://localhost:3001/lab_items_group")
        .then(function (response) {
          setSWorkTypeList(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const showDetail = (data) => {
    console.log(data[0]);

    setDetail(
      <table style={{ width: "-webkit-fill-available" }}>
        <tr>
          <td colSpan={3}>-------------------------------------------</td>
        </tr>

        <tr>
          <td>ประเภท</td>
          <td>:</td>
          <td>{data[0]["department"]}</td>
        </tr>
        <tr>
          <td>Remark</td>
          <td>:</td>
          <td>{data[0]["remark"]}</td>
        </tr>
        <tr>
          <td>Lab No</td>
          <td>:</td>
          <td>{data[0]["No"]}</td>
        </tr>
        <tr>
          <td>HN</td>
          <td>:</td>
          <td>{data[0]["HN"]}</td>
        </tr>
        <tr>
          <td>ชื่อ-สกุล</td>
          <td>:</td>
          <td>{data[0]["patient_name"]}</td>
        </tr>
        <tr>
          <td>อายุ</td>
          <td>:</td>
          <td>content</td>
        </tr>
        <tr>
          <td>เพศ</td>
          <td>:</td>
          <td>content</td>
        </tr>
        <tr>
          <td>วันเดือนปีเกิด</td>
          <td>:</td>
          <td>content</td>
        </tr>
        <tr>
          <td>ผู้ตรวจส่ง</td>
          <td>:</td>
          <td>{data[0]["patient_name"]}</td>
        </tr>
        <tr>
          <td>Ward</td>
          <td>:</td>
          <td>{data[0]["ward"]}</td>
        </tr>
        <tr>
          <td>วันที่ตรวจส่ง</td>
          <td>:</td>
          <td>{data[0]["approver_name"]}</td>
        </tr>
        <tr>
          <td>เวลาที่ส่งตรวจ</td>
          <td>:</td>
          <td>{data[0]["approved_date"]}</td>
        </tr>
        <tr>
          <td>ห้องที่ส่งตรวจ</td>
          <td>:</td>
          <td>{data[0]["approved_time"]}</td>
        </tr>
        <tr>
          <td>สิทธิ์</td>
          <td>:</td>
          <td>content</td>
        </tr>
        <tr>
          <td>ราคาที่ส่งตรวจ</td>
          <td>:</td>
          <td>content</td>
        </tr>
        <tr>
          <td colSpan={3}>------------- [ TEST ORDER ] ---------------</td>
        </tr>
        <tr>
          <td colSpan={3}>Lab Profile : </td>
        </tr>
        <tr>
          <td colSpan={3}>1.fdsffedsfefef</td>
        </tr>
        <tr>
          <td colSpan={3}>2.fdsffedsfefef</td>
        </tr>
        <tr>
          <td colSpan={3}>Lab Single : </td>
        </tr>
        <tr>
          <td colSpan={3}>1.fdsffedsfefef</td>
        </tr>
        <tr>
          <td colSpan={3}>2.fdsffedsfefef</td>
        </tr>
      </table>
    );
    setLoadingData(false);
  };

  const setStatusListonClick = (id) => {
    setStatusList(id);
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
    setSWorkType("All");
    setSWork(event.target.value);
    getWorkTypeList(event.target.value);
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
    getWorkTypeList(sWork);
  }, [sStartDate, sEndDate, sType, sInput, sWorkType, sDepart, sAddress]);

  const loadDetail = async (dataDetail) => {
    setLoadingData(true);
    return axios
      .get(`http://localhost:3001/lab_order_detail/${dataDetail.order_number}`)
      .then(function (response) {
        showDetail(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const loadData = async () => {
    setLoading(true);

    const filter = {
      date_start: sStartDate,
      date_stop: sEndDate,
      time_start: dayjs(sStartDate).format("HH:mm:ss"),
      time_stop: dayjs(sEndDate).format("HH:mm:ss"),
      department: sDepart,
      address: sAddress,
      type: sType,
      text: sInput,
      form_name: sWorkType,
    };

    console.log(sWorkType);
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
      });
  };
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
  const rangePresets = [
    {
      label: "ก่อนหน้านี้ 7 วัน",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 14 วัน",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 30 วัน",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 3 เดือน",
      value: [dayjs().subtract(3, "month"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 6 เดือน",
      value: [dayjs().subtract(6, "month"), dayjs()],
    },
    {
      label: "ก่อนหน้านี้ 1 ปี",
      value: [dayjs().subtract(12, "month"), dayjs()],
    },
  ];
  return (
    <ConfigProvider locale={thTH}>
      <Layout style={{ background: "white" }}>
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
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <RangePicker
                              block
                              presets={rangePresets}
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
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group onChange={inputSType} value={sType}>
                              <Radio value={1}>Barcode</Radio>
                              <Radio value={2}>HN</Radio>
                              <Radio value={3}>ชื่อ-สกุล</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col flex="auto">
                          <Form.Item
                            style={{ marginBottom: 5, marginTop: 5 }}
                            label=":"
                          >
                            <Input onChange={inputSInput} value={sInput} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group onChange={inputSWork} value={sWork}>
                              <Radio value={1}>งาน</Radio>
                              <Radio value={2}>Lab form</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Select
                              onChange={inputSWorkType}
                              value={sWorkType}
                              style={{
                                width: 200,
                              }}
                              options={sWorkTypeList}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                            <Radio.Group
                              onChange={inputSDepart}
                              value={sDepart}
                            >
                              <Radio value={"ALL"}>ALL</Radio>
                              <Radio value={"OPD"}>OPD</Radio>
                              <Radio value={"IPD"}>IPD</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col flex="auto">
                          <Form.Item
                            style={{ marginBottom: 5, marginTop: 5 }}
                            label="ที่อยู่ :"
                          >
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
                          All({dataCount["All"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Pending")}
                          type={
                            statusList === "Pending" ? "primary" : "default"
                          }
                          block
                        >
                          Pending({dataCount["Pending"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Received")}
                          type={
                            statusList === "Received" ? "primary" : "default"
                          }
                          block
                        >
                          Received({dataCount["Received"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={6}>
                        <Button
                          onClick={() => setStatusListonClick("Reject")}
                          type={statusList === "Reject" ? "primary" : "default"}
                          block
                        >
                          Reject({dataCount["Reject"].toLocaleString()})
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Checkbox style={{ padding: 5, paddingLeft: 20 }}>
                      Separate Tupe (FBS)
                    </Checkbox>
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
              <Spin spinning={loadingData} tip="กำลังโหลดข้อมูล" size="large">
                <Content>
                  <Card title="รายละเอียด Lab Order">{detail}</Card>
                  <Card title="Lab Note">{detailNote}</Card>
                  <Card title="ประเภทสิ่งส่งตรวจ">{detailThing}</Card>
                </Content>
              </Spin>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LabReq;
