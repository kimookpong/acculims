import { React, useEffect, useState, useRef } from "react";
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
  message,
  Modal,
} from "antd";
import {
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import ReactToPrint from "react-to-print";
import "./LabReq.css";
import DetailComponent from "./DetailComponent";
import DetailNoteComponent from "./DetailNoteComponent";
import DetailThingComponent from "./DetailThingComponent";
import BarcodeComponent from "./BarcodeComponent";

const API_server = "http://localhost:3001";
const API_post_list = API_server + "/lab_order";
const API_post_detail = API_server + "/lab_order_detail";
const API_post_barcode = API_server + "/lab_barcode";
const API_get_lab_form_head = API_server + "/lab_form_head";
const API_get_lab_items_group = API_server + "/lab_items_group";
const API_post_action = API_server + "/action_event";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD HH:mm";
const currDate = dayjs();
const beforeDate = currDate.subtract(4, "month");

function LabReq() {
  const componentRef = useRef();

  const [messageApi, messageContext] = message.useMessage();
  const closeModal = () => {
    Modal.destroyAll();
  };
  const showPrint = () => {
    return axios
      .post(API_post_barcode, {
        id: selectedRowKeys,
      })
      .then(function (response) {
        Modal.info({
          centered: true,
          width: 730,
          title: "พิมพ์ Barcode",
          icon: <PrinterOutlined />,
          content: (
            <div ref={componentRef}>
              <BarcodeComponent data={response.data} />
            </div>
          ),
          footer: (
            <div className="ant-modal-footer">
              <ReactToPrint
                trigger={() => {
                  return <Button key="back">พิมพ์</Button>;
                }}
                content={() => componentRef.current}
              />
              <Button key="submit" type="primary" onClick={closeModal}>
                ตกลง
              </Button>
            </div>
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
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
        .get(API_get_lab_form_head)
        .then(function (response) {
          setSWorkTypeList((oldArray) => [
            { label: "All", value: "All" },
            ...response.data,
          ]);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (id === 2) {
      return axios
        .get(API_get_lab_items_group)
        .then(function (response) {
          setSWorkTypeList((oldArray) => [
            { label: "All", value: "All" },
            ...response.data,
          ]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const showDetail = (data) => {
    setDetail(<DetailComponent data={data[0]} />);
    setDetailNote(<DetailNoteComponent data={data[0]} />);
    setDetailThing(<DetailThingComponent data={data[0]} />);
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

  const actionControl = async (action) => {
    if (action === "print") {
      console.log("print this");
      showPrint();
      setSelectedRowKeys([]);
      setLabDisable(true);
    } else {
      return axios
        .post(API_post_action, {
          id: selectedRowKeys,
          action: action,
        })
        .then(function (response) {
          messageApi.open({
            type: response.data.result === true ? "success" : "error",
            content: response.data.alert,
          });
          setSelectedRowKeys([]);
          setLabDisable(true);
          loadData();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const loadDetail = async (dataDetail) => {
    setLoadingData(true);
    return axios
      .post(API_post_detail, {
        id: dataDetail.order_number,
      })
      .then(function (response) {
        showDetail(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const loadData = async () => {
    setDetail(null);
    setDetailNote(null);
    setDetailThing(null);
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
      .post(API_post_list, filter)
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
      {messageContext}
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
                        <Col span={10}>
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
                            onClick={() => {
                              actionControl("accept");
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
                            onClick={() => {
                              actionControl("cancel");
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
                            onClick={() => {
                              actionControl("delete");
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
                            onClick={() => {
                              actionControl("print");
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
