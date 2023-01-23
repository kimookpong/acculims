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
  Tabs,
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
import "./LabReport.css";
import DetailComponent from "./DetailComponent";
import BarcodeComponent from "./BarcodeComponent";
import CancelComponent from "./CancelComponent";

const API_server = "http://localhost:3001";
const API_post_list = API_server + "/lab_report";
const API_post_detail = API_server + "/lab_order_detail";
const API_report_detail = API_server + "/lab_report_detail";
const API_post_barcode = API_server + "/lab_barcode";
const API_get_lab_form_head = API_server + "/lab_form_head";
const API_get_lab_items_group = API_server + "/lab_items_group";
const API_post_action = API_server + "/action_event";
const API_post_cancel_reason = API_server + "/action_calcel_reason";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD HH:mm";
const currDate = dayjs();
const beforeDate = currDate.subtract(4, "month");

function LabReport() {
  const componentRef = useRef();

  const [refreshKey, setRefreshKey] = useState(0);
  let dataRejectReason = [];
  const onAddRejectForm = (newItem) => {
    dataRejectReason = newItem;
  };
  const [messageApi, messageContext] = message.useMessage();
  const closeModal = () => {
    Modal.destroyAll();
  };
  const showConfirmDelete = (action) => {
    return axios
      .post(API_post_detail, {
        id: selectedRowKeys.join(),
      })
      .then(function (response) {
        Modal.confirm({
          centered: true,
          width: 700,
          title: "ยืนยันปฎิเสธสิ่งส่งตรวจ",
          content: (
            <CancelComponent
              data={response.data}
              rejectForm={onAddRejectForm}
            />
          ),
          onOk() {
            axios
              .post(API_post_cancel_reason, {
                id: selectedRowKeys.join(),
                form: dataRejectReason,
              })
              .then(function (response) {
                actionControl(action);
              });
          },
        });
      });
  };
  let acceptPrintBarcode = false;
  const changeAcceptPrintBarcode = (event) => {
    acceptPrintBarcode = event.target.checked;
    console.log(acceptPrintBarcode);
  };
  const showConfirm = (action) => {
    Modal.confirm({
      centered: true,
      title: action === "accept" ? "ยืนยันรับใบ LAB?" : "ยืนยันลบใบ LAB?",
      content: (
        <Row>
          <Col span={24}>เลขที่สั่ง : {selectedRowKeys.join()}</Col>
          <Col span={24}>
            {action === "accept" ? (
              <Checkbox onClick={changeAcceptPrintBarcode}>
                พิมพ์ Barcode
              </Checkbox>
            ) : null}
          </Col>
        </Row>
      ),
      onOk() {
        actionControl(action);
      },
    });
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
      });
  };
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [dataReportStatus, setDataReportStatus] = useState([]);
  const [statusList, setStatusList] = useState("All");
  const [dataCountReport, setDataCountReport] = useState({
    All: 0,
    Pending: 0,
    Process: 0,
    Completed: 0,
    Reported: 0,
    Approved: 0,
  });
  const [detail, setDetail] = useState(null);

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
      return axios.get(API_get_lab_form_head).then(function (response) {
        setSWorkTypeList((oldArray) => [
          { label: "All", value: "All" },
          ...response.data,
        ]);
      });
    } else if (id === 2) {
      return axios.get(API_get_lab_items_group).then(function (response) {
        setSWorkTypeList((oldArray) => [
          { label: "All", value: "All" },
          ...response.data,
        ]);
      });
    }
  };
  getWorkTypeList(sWork);

  const showDetail = (data) => {
    setDetail(<DetailComponent data={data[0]} />);
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
    const loadData = async () => {
      setDetail(null);
      setDataReport(null);
      setLoading(true);
      setDataReportStatus(null);

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
      return await axios.post(API_post_list, filter).then(function (response) {
        let dataArray = response.data;
        let count = {
          All: 0,
          Pending: 0,
          Process: 0,
          Completed: 0,
          Reported: 0,
          Approved: 0,
        };
        dataArray.forEach((d) => {
          if (d["h_status"] === "Pending") {
            count["Pending"] += 1;
          } else if (d["h_status"] === "Process") {
            count["Process"] += 1;
          } else if (d["h_status"] === "Completed") {
            count["Completed"] += 1;
          } else if (d["h_status"] === "Reported") {
            count["Reported"] += 1;
          } else if (d["h_status"] === "Approved") {
            count["Approved"] += 1;
          }
          count["All"] += 1;
        });
        console.log(count);
        setDataCountReport(count);
        setData(dataArray);
        setLoading(false);
      });
    };

    loadData();
  }, [
    refreshKey,
    sStartDate,
    sEndDate,
    sType,
    sInput,
    sWorkType,
    sDepart,
    sAddress,
  ]);

  const actionControl = async (action) => {
    if (action === "print") {
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

          if (acceptPrintBarcode) {
            showPrint();
          }
          setSelectedRowKeys([]);
          setLabDisable(true);
          setRefreshKey((oldKey) => oldKey + 1);
          //loadData();
          //setAcceptPrintBarcode(false);
          acceptPrintBarcode = false;
        });
    }
  };
  const loadReport = async (dataDetail) => {
    return axios
      .post(API_report_detail, {
        id: dataDetail.order_number,
      })
      .then(function (response) {
        // showDetail(response.data);
        setDataReport(response.data);
      });
  };
  const loadDetail = async (dataDetail) => {
    setLoadingData(true);
    return axios
      .post(API_post_detail, {
        id: dataDetail.order_number,
      })
      .then(function (response) {
        showDetail(response.data);
      });
  };

  const columns = [
    {
      title: "เลขที่สั่ง",
      dataIndex: "order_number",
      key: "order_number",
      sorter: {
        compare: (a, b) => a.order_number - b.order_number,
        multiple: 1,
      },
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
      ellipsis: true,
    },
    {
      title: "ชื่อใบสั่ง",
      dataIndex: "form_name",
      key: "form_name",
      ellipsis: true,
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
      ellipsis: true,
    },
    {
      title: "วันเวลาที่รับ",
      dataIndex: "time_receive_report",
      key: "time_receive_report",
      ellipsis: true,
    },
    {
      title: "ห้องที่ส่งตรวจ",
      dataIndex: "department",
      key: "department",
    },
  ];
  const columnsReport = [
    {
      title: "Test Name",
      dataIndex: "lab_items_name",
      key: "lab_items_name",
      sorter: {
        compare: (a, b) => a.order_number - b.order_number,
        multiple: 1,
      },
    },
    {
      title: "ผลตรวจเครื่อง",
      dataIndex: "lab_order_result_instrument",
      key: "lab_order_result_instrument",
    },
    {
      title: "ผลตรวจเอง",
      dataIndex: "lab_order_result_manual",
      key: "lab_order_result_manual",
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      render: (flag) => {
        if (flag === "H") {
          return <b style={{ color: "red" }}>{flag}</b>;
        } else if (flag === "L") {
          return <b style={{ color: "blue" }}>{flag}</b>;
        } else {
          return <>{flag}</>;
        }
      },
    },
    // {
    //   title: "Rerun",
    //   dataIndex: "form_name",
    //   key: "form_name",
    //   ellipsis: true,
    // },
    {
      title: "หน่วย",
      dataIndex: "lab_items_unit",
      key: "lab_items_unit",
    },
    {
      title: "ค่าปกติ",
      dataIndex: "lab_items_normal_value",
      key: "lab_items_normal_value",
    },
    // {
    //   title: "P#1",
    //   dataIndex: "time_receive_report",
    //   key: "time_receive_report",
    //   ellipsis: true,
    // },
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
            <Col xs={24} lg={24}>
              <Row>
                <Col xs={24} lg={3} className="iconMenu">
                  <h1>รายงานผล LAB</h1>
                </Col>
                <Col xs={24} lg={15}>
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
                            showSearch
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
                          <Radio.Group onChange={inputSDepart} value={sDepart}>
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
                <Col xs={24} lg={6}>
                  <Row style={{ padding: 24 }}>
                    <Col span={12}>
                      <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Select
                          showSearch
                          onChange={inputSWorkType}
                          value={sWorkType}
                          style={{
                            width: 150,
                          }}
                          options={sWorkTypeList}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item style={{ marginBottom: 5, marginTop: 5 }}>
                        <Checkbox>ปล่อยผล Rerun</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <h4 style={{ marginTop: 10 }}>
                        Status ={" "}
                        <span style={{ color: "red" }}>{dataReportStatus}</span>
                      </h4>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={12}>
              <Content>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("All")}
                          type={statusList === "All" ? "primary" : "default"}
                          block
                        >
                          All({dataCountReport["All"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Pending")}
                          type={
                            statusList === "Pending" ? "primary" : "default"
                          }
                          block
                        >
                          Pending({dataCountReport["Pending"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Process")}
                          type={
                            statusList === "Process" ? "primary" : "default"
                          }
                          block
                        >
                          Process(
                          {dataCountReport["Process"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Completed")}
                          type={
                            statusList === "Completed" ? "primary" : "default"
                          }
                          block
                        >
                          Completed(
                          {dataCountReport["Completed"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Reported")}
                          type={
                            statusList === "Reported" ? "primary" : "default"
                          }
                          block
                        >
                          Reported(
                          {dataCountReport["Reported"].toLocaleString()})
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => setStatusListonClick("Approved")}
                          type={
                            statusList === "Approved" ? "primary" : "default"
                          }
                          block
                        >
                          Approved(
                          {dataCountReport["Approved"].toLocaleString()})
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Content>
              <Content>
                <Spin spinning={loading} tip="กำลังโหลดข้อมูล" size="large">
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data.filter((d) => {
                      if (statusList === "All") {
                        return d;
                      } else if (statusList === d["h_status"]) {
                        return d;
                      }
                      return false;
                    })}
                    rowKey={"order_number"}
                    size="small"
                    scroll={{
                      x: 1300,
                    }}
                    sticky
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (event) => {
                          loadDetail(record);
                          loadReport(record);
                          setDataReportStatus(record.h_status);
                        }, // click row
                      };
                    }}
                  />
                </Spin>
              </Content>
              <Row>
                <Col span={12}>
                  <Spin
                    spinning={loadingData}
                    tip="กำลังโหลดข้อมูล"
                    size="large"
                  >
                    <Content>
                      <Card>
                        <Tabs
                          defaultActiveKey="2"
                          items={[
                            {
                              key: "1",
                              label: `::ความเห็นเจ้าหน้าที่`,
                              children: `Content of Tab Pane 1`,
                            },
                            {
                              key: "2",
                              label: `::รายละเอียด`,
                              children: <>{detail}</>,
                            },
                          ]}
                        />
                      </Card>
                    </Content>
                  </Spin>
                </Col>
                <Col span={12}>
                  <Spin
                    spinning={loadingData}
                    tip="กำลังโหลดข้อมูล"
                    size="large"
                  >
                    <Content>
                      <Card title="::กราฟค่าผล"></Card>
                    </Content>
                  </Spin>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={12}>
              <Content>
                <Row>
                  <Col span={24}>
                    <Spin spinning={loading} tip="กำลังโหลดข้อมูล" size="large">
                      <Table
                        // rowSelection={rowSelectionReport}
                        columns={columnsReport}
                        dataSource={dataReport}
                        rowKey={"lab_items_name"}
                        size="small"
                        // scroll={{
                        //   x: 1300,
                        // }}
                        sticky
                        onRow={(record, rowIndex) => {
                          return {
                            onClick: (event) => {
                              //loadDetail(record);
                            }, // click row
                          };
                        }}
                      />
                    </Spin>
                  </Col>
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
                                showConfirm("accept");
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
                                showConfirmDelete("reject");
                              }}
                              disabled={
                                selectedRowKeys.length === 1 ? false : true
                              }
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
                                showConfirm("delete");
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
                              <div>พิมพ์ Barcode ซ้ำ</div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Content>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default LabReport;
