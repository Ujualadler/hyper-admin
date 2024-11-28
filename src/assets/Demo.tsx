import React, { useEffect, useMemo, useRef, useState } from "react";
import "../assets/styles/AddAssessment.css";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { getAssessment, postAssessment } from "../service/AssessmentService";

interface PopupFormProps {
  onClose: any; // Function to close the modal
  id: string;
}

// Define types for question types and questions
type QuestionType = "multipleChoice" | "singleChoice" | "yesNo" | "descriptive";

interface Option {
  text: string;
  file: File | null;
  filePreview: string | null;
}

interface Question {
  text: string;
  type: QuestionType;
  mark: number;
  options?: Option[];
  correctAnswer: string | string[];
  file?: File | null;
}

function AddAssessment({ onClose, id }: PopupFormProps) {
  const QuillRef = useRef<any>();
  const optionRefs = useRef<any[]>([]);
  const fileRef = useRef<any>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessmentData, setAssessmentData] = useState<any>({});
  const [editedIndex, setEditedIndex] = useState<number>();
  const [questionText, setQuestionText] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [questionMark, setQuestionMark] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionType, setQuestionType] =
    useState<QuestionType>("multipleChoice");
  const [options, setOptions] = useState<Option[]>([
    { text: "", file: null, filePreview: null },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>(""); // Multiple correct answers
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const response = await getAssessment(id);

      if (response) {
        setQuestions(response?.questions);
      }
    })();
  }, []);

  // Handle adding new question
  const addQuestion = async () => {
    try {
      const emptyValue = options.some((data) => data.text.trim() === "");

      if (!questionMark) {
        toast.error("Please fill in the question mark.");
        return;
      }
      if (questionText.replace(/<(.|\n)*?>/g, "").trim() === "") {
        console.log(questionText);
        toast.error("Please fill in the question text.");
        return;
      }
      if (
        questionType === "multipleChoice" ||
        questionType === "singleChoice"
      ) {
        if (emptyValue) {
          toast.error(
            "Please fill in the empty option before adding the question."
          );
          return;
        }
      }

      const newQuestion: Question = {
        text: questionText,
        type: questionType,
        mark: questionMark,
        options:
          questionType === "multipleChoice" || questionType === "singleChoice"
            ? options
            : undefined,
        correctAnswer,
        file: attachedFile,
      };

    //   const response = await postAssessment(newQuestion, id);

    //   if (response.message === "Created Successfully") {
    //     toast.success("success");
    //   }

      handleClearFile();
      setQuestions([...questions, newQuestion]);
      // Reset fields after adding
      setQuestionText("");
      setOptions([{ text: "", file: null, filePreview: null }]);
      setQuestionMark(0);
      setCorrectAnswer("");
      setAttachedFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle option changes for multiple choice and single choice
  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachedFile(event.target.files[0]);
      const filePreview = URL.createObjectURL(event.target.files[0]);
      setImagePreview(filePreview);
    }
  };

  const handleOptionFileChange = (index: number, file: File | null) => {
    const newOptions = [...options];
    if (file) {
      const filePreview = URL.createObjectURL(file);
      newOptions[index] = { ...newOptions[index], file, filePreview };
    } else {
      newOptions[index] = {
        ...newOptions[index],
        file: null,
        filePreview: null,
      };
    }
    setOptions(newOptions);
  };

  // Handle preventing page reload on 'Add Option'
  const handleAddOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const emptyValue = options.some((data) => data.text === "");
    if (emptyValue) {
      toast.error("Please fill in the empty option before adding a new one.");
      return;
    }

    console.log(options);
    setOptions([...options, { text: "", file: null, filePreview: null }]);
  };

  console.log(questions);

  const handleFileDelete = (index: number) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], file: null, filePreview: null };
    setOptions(newOptions);
  };

  // Remove an option
  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, optIndex) => optIndex !== index);
    setOptions(newOptions);
  };

  // Handle multiple correct answers for multiple-choice questions
  const handleMultipleChoiceChange = (option: string) => {
    let newCorrectAnswer: string[] = Array.isArray(correctAnswer)
      ? [...correctAnswer]
      : [];

    if (newCorrectAnswer.includes(option)) {
      newCorrectAnswer = newCorrectAnswer.filter((ans) => ans !== option);
    } else {
      newCorrectAnswer.push(option);
    }

    setCorrectAnswer(newCorrectAnswer);
  };

  const imageHandler = (e: any) => {
    const editor = QuillRef.current.getEditor();
    console.log(editor);
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files) {
        return;
      }
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        console.log(file);
        const formData = new FormData();
        formData.append("image", file);
        // const res = await ImageUpload(formData);
        // const url = res?.data?.url;
        // editor.insertEmbed(editor.getSelection(), "image", url);
      } else {
        console.log("You could only upload images");
      }
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image", "link"],
          [
            {
              color: [
                "#000000",
                "#e60000",
                "#ff9900",
                "#ffff00",
                "#008a00",
                "#0066cc",
                "#9933ff",
                "#ffffff",
                "#facccc",
                "#ffebcc",
                "#ffffcc",
                "#cce8cc",
                "#cce0f5",
                "#ebd6ff",
                "#bbbbbb",
                "#f06666",
                "#ffc266",
                "#ffff66",
                "#66b966",
                "#66a3e0",
                "#c285ff",
                "#888888",
                "#a10000",
                "#b26b00",
                "#b2b200",
                "#006100",
                "#0047b2",
                "#6b24b2",
                "#444444",
                "#5c0000",
                "#663d00",
                "#666600",
                "#003700",
                "#002966",
                "#3d1466",
              ],
            },
          ],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  console.log(questions);

  const handleDelete = (index: number) => {
    console.log(questions);
    console.log(index);
    const newQuestions = questions.filter((_, i) => i !== index); // Return a new array excluding the item at the given index
    setQuestions(newQuestions); // Update the state with the new array
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form Submitted");
  }

  function handleEdit(data: Question, index: number) {
    setEditedIndex(index);
    setQuestionText(data.text);
    setQuestionMark(data.mark);
    setQuestionType(data.type);
    if (data.file) {
      setAttachedFile(data.file);
      setImagePreview(URL.createObjectURL(data.file));
    }
    if (
      data.options &&
      (data.type === "multipleChoice" || data.type === "singleChoice")
    ) {
      setOptions(data.options);
    }

    setCorrectAnswer(data.correctAnswer);
    setIsEdit(true);
  }

  function updateQuestion() {
    const newQuestion: Question = {
      text: questionText,
      type: questionType,
      mark: questionMark,
      options:
        questionType === "multipleChoice" || questionType === "singleChoice"
          ? options
          : undefined,
      correctAnswer,
      file: attachedFile,
    };
    // setImagePreview(URL.createObjectURL())
    if (editedIndex !== null && editedIndex !== undefined) {
      const updatedQuestions = [...questions]; // Create a copy of the questions array
      updatedQuestions[editedIndex] = newQuestion; // Update the specific question by index

      setQuestions(updatedQuestions); // Set the updated array as the new state
      handleCancelEdit();
    }
  }

  function handleCancelEdit() {
    handleClearFile();
    setIsEdit(false);
    setQuestionMark(0);
    setCorrectAnswer("");
    setQuestionText("");
    setQuestionType("singleChoice");
    setOptions([{ text: "", file: null, filePreview: null }]); // Reset to a single empty option
  }

  const handleClearFile = () => {
    setAttachedFile(null);
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = ""; // Clear the file input programmatically
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup" style={{ width: "80vw", height: "90vh" }}>
        <div className="modal-top-assessment">
          <img
            onClick={() => onClose(false)}
            src="https://img.icons8.com/?size=100&id=71200&format=png&color=000000"
          />
        </div>
        <div className="assessment-main-grid">
          <form onSubmit={handleSubmit}>
            <div className="containerAssessment">
              {isEdit ? <h2>Edit Assessment</h2> : <h2>Create Assessment</h2>}

              <label>Question Type</label>
              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value as QuestionType)
                }
              >
                <option value="multipleChoice">Multiple Choice</option>
                <option value="singleChoice">Single Choice</option>
                <option value="yesNo">Yes/No</option>
                <option value="descriptive">Descriptive</option>
              </select>

              <label>Question Mark</label>
              <input
                type="number"
                onChange={(e) => setQuestionMark(e.target.value as any)}
              />
              <label>Attach Image/File</label>
              <input ref={fileRef} type="file" onChange={handleFileUpload} />
              {imagePreview && (
                <div
                  style={{
                    position: "relative",
                    width: "fit-content",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    onClick={handleClearFile}
                    src="https://img.icons8.com/?size=100&id=OZuepOQd0omj&format=png&color=000000"
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      height: "20px",
                      width: "20px",
                      cursor: "pointer",
                    }}
                  />
                  <img
                    src={imagePreview}
                    style={{ height: "200px", width: "100%" }}
                  />
                </div>
              )}
              <label>Question Text</label>
              <ReactQuill
                theme="snow"
                ref={QuillRef}
                value={questionText}
                onChange={setQuestionText}
                // modules={modules}
              />

              {(questionType === "multipleChoice" ||
                questionType === "singleChoice") && (
                <div>
                  <label>Options</label>
                  {options.map((option, index) => (
                    <>
                      <div style={{ display: "flex", gap: 3 }} key={index}>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                        />
                        <img
                          onClick={() => optionRefs.current[index]?.click()}
                          src="https://img.icons8.com/?size=100&id=X8KeZWFUUtu4&format=png&color=000000"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <input
                          style={{ width: "20%", display: "none" }}
                          ref={(el) => (optionRefs.current[index] = el)}
                          onChange={(e) =>
                            handleOptionFileChange(
                              index,
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                          type="file"
                        />
                      </div>
                      {option.filePreview && (
                        <div
                          style={{
                            position: "relative",
                            width: "fit-content",
                            marginBottom: "10px",
                          }}
                        >
                          <h5
                            style={{
                              margin: 0,
                              padding: 0,
                              marginBottom: "10px",
                            }}
                          >
                            Selected Image:
                          </h5>
                          <img
                            onClick={() => handleFileDelete(index)}
                            src="https://img.icons8.com/?size=100&id=OZuepOQd0omj&format=png&color=000000"
                            style={{
                              position: "absolute",
                              top: 20,
                              right: -8,
                              height: "20px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                          />
                          <img
                            src={option?.filePreview}
                            alt="Selected Preview"
                            style={{
                              objectFit: "fill",
                              width: "100px",
                              height: "100px",
                              // marginTop: "10px",
                            }}
                          />
                        </div>
                      )}
                    </>
                  ))}
                  <button type="button" onClick={handleAddOption}>
                    Add Option
                  </button>
                </div>
              )}

              {questionType === "multipleChoice" && options.length > 1 && (
                <div>
                  <label>Select Correct Answer(s)</label>
                  {options.map((option, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        width: "100%",
                        gap: 5,
                        flexDirection: "row",
                      }}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(correctAnswer) &&
                            correctAnswer.includes(option.text)
                          }
                          onChange={() =>
                            handleMultipleChoiceChange(option.text)
                          }
                        />
                      </label>

                      <h5>{option.text}</h5>
                    </div>
                  ))}
                </div>
              )}

              {questionType === "singleChoice" && options.length > 1 && (
                <div>
                  <label>Correct Answer</label>
                  <select
                    value={correctAnswer as string}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  >
                    <option value="">Select Correct Answer</option>
                    {options.map((option, index) => (
                      <option key={index} value={option.text}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {questionType === "yesNo" && (
                <div>
                  <label>Correct Answer</label>
                  <select
                    value={correctAnswer as string}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              )}

              {isEdit ? (
                <div
                  style={{ display: "flex", justifyContent: "end", gap: 10 }}
                >
                  <button
                    type="button"
                    style={{ width: "fit-content", background: "orange" }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={{ width: "fit-content" }}
                    onClick={updateQuestion}
                  >
                    Update Question
                  </button>
                </div>
              ) : (
                <div
                  style={{ display: "flex", justifyContent: "end", gap: 10 }}
                >
                  <button
                    type="button"
                    style={{ width: "fit-content" }}
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Preview Section */}
          <div>
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "10px",
                minHeight: "82vh",
                maxHeight: "82vh",
                overflow: "auto",
                padding: "20px",
              }}
            >
              <h2>Added Questions</h2>
              <div>
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#ffff",
                        borderRadius: "10px",
                        paddingBlock: "10px",
                        paddingInline: "15px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "10px",
                              color: "black",
                              fontWeight: "bold",
                              borderRadius: "50%",
                              height: "30px",
                              width: "30px",
                              border: "2px solid black",
                            }}
                          >
                            {index + 1}
                          </p>
                          <p
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />
                          <p style={{ marginLeft: "10px" }}>
                            (mark : {question.mark})
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <img
                            onClick={() => handleEdit(question, index)}
                            src="https://img.icons8.com/?size=100&id=114093&format=png&color=000000"
                            style={{
                              height: "20px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                          />
                          <img
                            onClick={() => handleDelete(index)}
                            src="https://img.icons8.com/?size=100&id=OD5jprZTbcDK&format=png&color=000000"
                            style={{
                              height: "20px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                      {question.file && (
                        <div>
                          <img src={URL.createObjectURL(question.file)} />
                        </div>
                      )}
                      <div style={{ marginLeft: "42px" }}>
                        {question.type === "multipleChoice" &&
                          question.options && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                gap: 8,
                              }}
                            >
                              <label>Choose one or more options:</label>
                              {question.options.map((option, optIndex) => (
                                <>
                                  <div key={optIndex}>
                                    <label>
                                      <input type="checkbox" disabled />
                                      {option.text}
                                    </label>
                                    {/* <img src={option}/> */}
                                  </div>
                                  {option.filePreview && (
                                    <img
                                      style={{
                                        height: "150px",
                                        width: "150px",
                                      }}
                                      src={option.filePreview}
                                    />
                                  )}
                                </>
                              ))}
                            </div>
                          )}
                        {question.type === "singleChoice" &&
                          question.options && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                gap: 8,
                              }}
                            >
                              <label>Choose one option:</label>
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex}>
                                  <div
                                    style={{
                                      marginBottom: "10px",
                                      marginRight: "125px",
                                    }}
                                  >
                                    <label>
                                      <input
                                        type="radio"
                                        name={`singleChoice-${index}`}
                                        disabled
                                      />
                                      {option?.text}
                                    </label>
                                  </div>
                                  {option.filePreview && (
                                    <img
                                      style={{
                                        height: "150px",
                                        width: "150px",
                                      }}
                                      src={option.filePreview}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        {question.type === "yesNo" && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              gap: 8,
                            }}
                          >
                            <label>Yes/No:</label>
                            <div>
                              <label>
                                <input
                                  type="radio"
                                  name={`yesNo-${index}`}
                                  value="yes"
                                  disabled
                                />
                                Yes
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name={`yesNo-${index}`}
                                  value="no"
                                  disabled
                                />
                                No
                              </label>
                            </div>
                          </div>
                        )}
                        {question.type === "descriptive" && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "start",
                              gap: 8,
                            }}
                          >
                            <label>Your Answer:</label>
                            <textarea
                              placeholder="Enter your answer here"
                              rows={4}
                              disabled
                            ></textarea>
                          </div>
                        )}
                        <p style={{ textAlign: "left", color: "black" }}>
                          Correct Answer :{" "}
                          {Array.isArray(question.correctAnswer)
                            ? question.correctAnswer.join(", ")
                            : question.correctAnswer}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "60vh",
                      color: "grey",
                    }}
                  >
                    <h5>No Questions Added</h5>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default AddAssessment;