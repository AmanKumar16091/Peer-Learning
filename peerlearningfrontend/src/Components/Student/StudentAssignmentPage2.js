import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import { G_API, API } from "../../config";
import StudentAssignmentView1 from "./StudentAssignmentView1";
import StudentAssignmentView2 from "./StudentAssignmentView2";
import Spinner from "../Spinner/Spinner";


const StudentAssignmentPage2 = () => {

    const { user, userData, setUserData, assignment, role } = useContext(AuthContext);
    const _id = assignment._id;
    const course_id = assignment.course_id;

    const [assignment1, setAssignment1] = useState([]); //for storing info about the assignment fetched from both classroom and peer learning
    const [assignment2, setAssignment2] = useState({});
    const [activities, setActivities] = useState([]); //for storing info about a student and their reviewers info with marks and comments
    const [self, setSelf] = useState({});
    const [mail, setMail] = useState("");
    const [reviewerCount, setReviewerCount] = useState(0);
    const [marks, setMarks] = useState([]); //for storing marks matrix
    const [spin1, setSpin1] = useState(true);
    const [spin2, setSpin2] = useState(true);
    const [youractivities, setyourActivities] = useState([]);

    const currentDate = new Date();
    // Specify your deadline year, month, day, hour, and minute values
    const deadlineYear = assignment.dueDate.year;
    const deadlineMonth = assignment.dueDate.month;
    const deadlineDay = assignment.dueDate.day;
    const deadlineHour = assignment.dueTime.hours;
    const deadlineMinutes = assignment.dueTime.minutes;

    // Create the deadline date objects
    const deadlineDate = new Date(deadlineYear, deadlineMonth - 1, deadlineDay, deadlineHour, deadlineMinutes); // Subtract 1 from the month because it's zero-based
    
    // Compare the current date with the deadline date
    const isDeadlinePassed = currentDate > deadlineDate;


    const loadData = async () =>{
        if (userData.token) {
            // setUserData((u) => ({ ...u, loader: u.loader + 1 }));
            await fetch(`${API}/api/peer/assignment?peer_assignment_id=${_id}`)
              .then((res) => res.json())
              .then(async (res) => {
                await fetch(
                  `${G_API}/courses/${course_id}/courseWork/${res.assignment_id}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  }
                )
                  .then((r) => r.json())
                  .then((r) => {
                    setAssignment1({ ...res, ...r }); 
                    setMarks(res.max_marks_per_question);
                    setSpin1(false);
                  });
              });
          }
    }

    useEffect(() => { loadData() }, [userData.token]);

    const getStudentReviews1 = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/reviewerassignments?course_work_id=${assignment1.assignment_id}&user_id=${user.sub}`)
        .then((res) => res.json())
        .then((res) => {
          let ac = [];
          res.forEach((r) => {
            if (r.review_score.length === 0) {
              r.review_score = Array(assignment1.total_questions).fill(0);
              r.reviewer_comment = Array(assignment1.total_questions).fill("");
            }
            if (r.author_id !== r.reviewer_id) {
              ac.push(r);
            } else {
              setSelf(r);
            }
          });
          setActivities(ac);
          setSpin2(false);
        });
    };

    const getStudentReviews2 = async () => {
        //setUserData((u) => ({ ...u, loader: u.loader + 1 }));
        await fetch(`${API}/api/reviews?peer_assignment_id=${_id}&student_id=${user.sub}`)
          .then((res) => res.json())
          .then((res) => {
            setActivities(res);
            setSpin2(false);
            //setUserData((u) => ({ ...u, loader: u.loader - 1 }));
          });
        await fetch(`${API}/api/yourreviews?peer_assignment_id=${_id}&student_id=${user.sub}`)
          .then((res) => res.json())
          .then((res) => {
            setyourActivities(res);
            //console.log(res);
            setSpin2(false);
      });
    }; 

    useEffect(() => { 
        if (role === "student" && assignment1.status === "Assigned"){
            getStudentReviews1();
        }
        if (role === "student" && assignment1.status === "Grading"){
            getStudentReviews2();
        }        
    }, [role, assignment1._id, assignment1.status]);


    const stopPeerLearning = async () => {
      try {
          if (userData.token) {
              await fetch(`${API}/api/closeassignment?peer_assignment_id=${_id}`, {
              method: "POST",
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
              },
                body: JSON.stringify({
                  peer_assignment_id: _id,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                    //alert("Peer Review Stoped");
                });
            }
        } catch (error) {
          console.error('Error:', error);
        }
  }

    
  if(isDeadlinePassed){
    stopPeerLearning();
      return (
          <>
          {spin1 && spin2 ? <Spinner/>
              :   <StudentAssignmentView2 assg={assignment1} activities={activities} marks={marks} setActivities={setActivities} youractivities={youractivities} setyourActivities={setyourActivities}/>
          }
          </>
      );
  }
  else{
    return (
      <>
      {spin1 && spin2 ? <Spinner/>
          :   <div className="dashboard">
                  <div className="contain">
                      {  role === "student" ?
                              
                               assignment1.status === "Assigned" ? <StudentAssignmentView1 assg={assignment1}  self={self} activities={activities} marks={marks} setSelf={setSelf} setActivities={setActivities} />
                               : <StudentAssignmentView2 assg={assignment1} activities={activities} marks={marks} setActivities={setActivities} youractivities={youractivities} setyourActivities={setyourActivities}/>
                          : null
                      }
                  </div>
              </div>
      }
      </>
    );
  }


    // return (
    //     <>
    //     {spin1 && spin2 ? <Spinner/>
    //         :   <div className="dashboard">
    //                 <div className="contain">
    //                     {  role === "student" ?
                                
    //                              assignment1.status === "Assigned" ? <StudentAssignmentView1 assg={assignment1}  self={self} activities={activities} marks={marks} setSelf={setSelf} setActivities={setActivities} />
    //                              : <StudentAssignmentView2 assg={assignment1} activities={activities} marks={marks} setActivities={setActivities}/>
    //                         : null
    //                     }
    //                 </div>
    //             </div>
    //     }
    //     </>
    // );
};

export default StudentAssignmentPage2;