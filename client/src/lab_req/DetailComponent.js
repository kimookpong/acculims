const DetailComponent = (props) => {
  const { data } = props;
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        <tr>
          <td colSpan={3}>-------------------------------------------</td>
        </tr>

        <tr>
          <td>ประเภท</td>
          <td>:</td>
          <td>{data["department"]}</td>
        </tr>
        <tr>
          <td>Remark</td>
          <td>:</td>
          <td>{data["remark"]}</td>
        </tr>
        <tr>
          <td>Lab No</td>
          <td>:</td>
          <td>{data["No"]}</td>
        </tr>
        <tr>
          <td>HN</td>
          <td>:</td>
          <td>{data["HN"]}</td>
        </tr>
        <tr>
          <td>ชื่อ-สกุล</td>
          <td>:</td>
          <td>{data["patient_name"]}</td>
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
          <td>{data["patient_name"]}</td>
        </tr>
        <tr>
          <td>Ward</td>
          <td>:</td>
          <td>{data["ward"]}</td>
        </tr>
        <tr>
          <td>วันที่ตรวจส่ง</td>
          <td>:</td>
          <td>{data["approver_name"]}</td>
        </tr>
        <tr>
          <td>เวลาที่ส่งตรวจ</td>
          <td>:</td>
          <td>{data["approved_date"]}</td>
        </tr>
        <tr>
          <td>ห้องที่ส่งตรวจ</td>
          <td>:</td>
          <td>{data["approved_time"]}</td>
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
      </tbody>
    </table>
  );
};

export default DetailComponent;
