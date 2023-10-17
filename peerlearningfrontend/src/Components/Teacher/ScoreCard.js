import React, { useEffect, useState } from "react";
import editIcon from "../Images/editIcon.png";

export const ScoreCard = (props) => {
  const [isShown, setIsShown] = useState(false);
  //console.log(props.data);
  return (
    <div
      className="link-with-preview"
      onClick={() => setIsShown(!isShown)} // Toggle the state on click
      style={{ cursor: 'pointer' }} // Apply the cursor style
    >
      <span> {props.children} </span>
      {isShown && <Card data={props.data} questions={props.questions} />}
    </div>
  );
};

const Card = (props) => {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let i = 0;
    props.data.review_score.forEach((s) => {
      i = i + s;
    });
    setScore(i);
  }, []);

  const handleEditMarks = () => {console.log("edit edit")}

  return (
    <div className="card" style={{ width: "400px", marginLeft: "150px", marginRight: "150px"}}>
      <p style={{ fontSize: "17px", fontWeight:"bold", marginLeft: "10px" }}>Total Score: {score}</p>
      <table style={{ width: "90%", backgroundColor: "white", marginLeft: "10px", fontSize: "15px" }}>
        <tr style={{ backgroundColor: "#4285F4", color: "white" }}>
          <th>Questions</th>
          <th>Marks</th>
          <th>Comments</th>
          <th>Edit Marks</th>
        </tr>
        {Array(props.questions).fill(0).map((i, index) => (
          <>
            <tr>
              <td key={`${index}-${props.data.name.fullName}`}> Q{index + 1} </td>
              <td> {props.data.review_score[index]} </td>
              <td> {props.data.reviewer_comment[index]} </td>
              <td><img src={editIcon} alt="edit" onClick={() => handleEditMarks()}/></td>
            </tr>
          </>
        ))}
      </table>
      <p style={{ fontSize: "15px", fontWeight:"bold", marginTop: "10px", marginLeft: "10px" }}>View Submission :
        <a target="_blank" rel="noreferrer" href={props.data.material_drive_link} style={{ height: "20px", marginLeft: "10px" }}>
          <input type="text" value="Answersheet.pdf" style={{ marginTop: "8px", textAlign: "center", cursor: "pointer", backgroundColor: "white" }} ></input>
        </a>
      </p>
    </div>
  );
};
