import { useState } from "react";
import { Input } from "antd";
const { TextArea } = Input;
const DetailNoteComponent = (props) => {
  const { data } = props;
  const [note, setNote] = useState(data["order_note"]);
  const inputNote = (event) => {
    console.log(event.target.value);
    setNote(event.target.value);
  };
  const commitNote = () => {
    console.log("send data of " + data["lab_order_number"] + " : " + note);
  };
  return (
    <table style={{ width: "-webkit-fill-available" }}>
      <tbody>
        <tr>
          <td>
            <TextArea
              onChange={inputNote}
              onKeyUp={commitNote}
              // rows={4}
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
              value={note}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DetailNoteComponent;
