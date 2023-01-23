import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";
const { TextArea } = Input;
const DetailNoteComponent = (props) => {
  const { data, api } = props;
  let noteCheck = data["order_note"];
  const [note, setNote] = useState(noteCheck);
  const inputNote = (event) => {
    setNote(event.target.value);
  };
  useEffect(() => {
    setNote(noteCheck);
  }, [noteCheck]);
  const commitNote = (event) => {
    return axios.post(api, {
      id: data["lab_order_number"],
      note: note,
    });
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
