import React, { useEffect, useState } from "react";
import { DashboardContainer } from "../containers/DashboardContainer";
import {
  deleteAssessment,
  getAllAssessment,
} from "../service/AssessmentService";
import { Box, Button, Grid2, Typography } from "@mui/material";
import AddAssessment from "../components/AddAssessment";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";

function Assessment() {
  const [assessmentData, setAssessmentData] = useState<any>([]);
  const [selectedID, setSelectedID] = useState<string>("");
  const [ID, setID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [change, setChange] = useState<boolean>(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [addAssessment, setAddAssessment] = useState(false);
  const [showConfiramtion, setShowConfirmation] = useState(false);
  const [category, setCategory] = useState('all');
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllAssessment(category);
        if (response.data) {
          setAssessmentData(response.data);
        }
        console.log(assessmentData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [change]);

  function handleAssessmentClick(id: any, title: string) {
    setSelectedID(id);
    setName(title);
    setShowAssessment(true);
  }

  function handleConfirmation(id: any) {
    setID(id);
    setShowConfirmation(true);
  }

  async function handleDelete() {
    try {
      const response = await deleteAssessment(ID);
      if (response.message === "Question deleted successfully") {
        setChange(!change);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }

      setShowConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <DashboardContainer>
      {showAssessment && selectedID !== "" && name !== "" && (
        <AddAssessment
          onClose={setShowAssessment}
          name={name}
          id={selectedID}
        />
      )}
      {addAssessment && (
        <AddAssessment onClose={setAddAssessment} name={name} />
      )}
      {showConfiramtion && ID !== "" && (
        <ConfirmationModal
          show={setShowConfirmation}
          open={showConfiramtion}
          handle={handleDelete}
        />
      )}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1>Quiz List</h1>
        <button className="button" onClick={() => setAddAssessment(true)}>
          Add Quiz
        </button>
      </Box>
      <Grid2 container spacing={3} mt={4}>
        {assessmentData.length > 0 &&
          assessmentData.map((data: any, index: number) => (
            <Grid2 key={index} size={{ lg: 4, xl: 3, xs: 12, sm: 6 }}>
              <Box borderRadius={4} p={3} boxShadow={3}>
                <Typography
                  textAlign={"left"}
                  sx={{ color: "black" }}
                  fontWeight={600}
                >
                  {data.name}
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mt={2}
                >
                  <Typography>Quiz Category</Typography>
                  <Typography>{data?.category}</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={1} mt={2}>
                  <button
                    onClick={() => handleConfirmation(data._id)}
                    style={{
                      width: "100%",
                      marginTop: 2,
                      textTransform: "none",
                      background: "#e74c3c",
                      height: "30px",
                      borderRadius: "10px",
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAssessmentClick(data._id, data.name)}
                    // variant="contained"
                    style={{
                      width: "100%",
                      marginTop: 2,
                      textTransform: "none",
                      height: "30px",
                      borderRadius: "10px",
                    }}
                  >
                    View
                  </button>
                </Box>
              </Box>
            </Grid2>
          ))}
      </Grid2>
    </DashboardContainer>
  );
}

export default Assessment;
