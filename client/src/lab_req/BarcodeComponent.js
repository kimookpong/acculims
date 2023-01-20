import BarcodeDetail from "./BarcodeDetail";

const BarcodeComponent = (props) => {
  const { data } = props;
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        {data.map((element) => {
          return (
            <tr key={element["order_number"]} style={{ textAlign: "center" }}>
              <td>
                <BarcodeDetail element={element} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BarcodeComponent;
