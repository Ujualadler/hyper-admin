import React, { useEffect, useState } from "react";
import { DashboardContainer } from "../containers/DashboardContainer";
import {
  editPPT,
  getCategories,
  getPPTList,
  uploadPPT,
} from "../service/SchoolDetailsService";
import "../assets/styles/Login.css"; // Importing your CSS styles
import "../assets/styles/Button.css";
import "../assets/styles/Users.css";
import "../assets/styles/SchoolDetails.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddAssessment from "../components/AddAssessment";
import { UploadVideoPopup } from "../components/UploadVideoPopup";

interface FormDataType {
  ppt: Array<any>;
  thumbnail: Array<any>;
  title: string;
  category: string;
  description: string;
}

interface IVFormDataType {
  id: string;
  video: Array<any>;
}

export const SchoolDetails: React.FC<any> = () => {
  const notify = (message: string) => toast(message);

  const [formData, setFormData] = useState<FormDataType>({
    ppt: [],
    thumbnail: [],
    title: "",
    category: "",
    description: "",
  });

  const [isLogin, setLogin] = useState(false);

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedID, setSelectedID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [pptList, setPPTList] = useState([]);

  const [add, setAdd] = useState(false);

  const [uploadOpen, setUploadOpen] = useState<boolean>(false);

  const [id, setId] = useState<string>("");

  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const response = await getCategories();
        const data = await getPPTList();
        console.log(
          "response>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
          response.data
        );
        setCategories(response.data);
        setPPTList(data?.data);
      } catch (error: any) {
        console.log("Error:", error);

        // Check if the error contains a status or message
        if (error?.status) {
          console.log(`Error Status: ${error.status}`);
          // Handle specific status codes like 401, 403
          if (error.status === 401 || error.status === 403) {
            handleLogout(); // Assuming you have a `handleLogout` function
          }
        } else {
          console.error("An unknown error occurred:", error.message || error);
        }
      }
    })();
  }, []);

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangeInput = (e: any) => {
    const { name, value, files } = e.target;
    console.log(files);
    if (name === "ppt" && files) {
      setFormData((prev) => ({
        ...prev,
        ppt: [files[0]],
      }));
    } else if (name === "thumbnail" && files) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: [files[0]],
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else if (name === "category") {
      if (value.length) {
        const filtered = categories.filter((cat: string) =>
          cat.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filtered);
        setShowSuggestions(true);
      } else {
        setFilteredCategories([]);
        setShowSuggestions(false);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const newFormData = new FormData();
      newFormData.append("title", formData.title);
      newFormData.append("description", formData.description);
      newFormData.append("category", formData.category);

      console.log("formData", formData, editData?._id, editData?.categoryId);
      if (formData?.ppt?.length && typeof formData?.ppt !== "string")
        formData?.ppt?.map((file) => newFormData.append("ppt", file));
      if (
        formData?.thumbnail?.length &&
        typeof formData?.thumbnail !== "string"
      )
        formData?.thumbnail?.map((file) =>
          newFormData.append("thumbnail", file)
        );

      let response;
      if (editData?._id) {
        newFormData.append("id", editData?._id);
        newFormData.append("categoryId", editData?.categoryId);
        response = await editPPT(newFormData);
      } else {
        response = await uploadPPT(newFormData);
      }
      if (response) {
        notify(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
    setShowSuggestions(false);
  };

  const handleDelete = (id: string) => {};

  const handleUpload = (id: string) => {
    setUploadOpen(!uploadOpen);
    setId(id);
  };

  const handleEdit = (data: FormDataType, title: string, id: string) => {
    console.log("edit", data);
    setEditData({ ...data, categoryId: id });
    setFormData({ ...data, category: title });
    setAdd(true);
  };

  const handleCancel = () => {
    setAdd(!add);
    setFormData({
      ppt: [],
      thumbnail: [],
      title: "",
      category: "",
      description: "",
    });
  };

  function handleAssessmentClick(id: any, title: string) {
    setSelectedID(id);
    setName(title);
    setShowAssessment(true);
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
      <button
        className="button"
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100px",
          marginTop: "auto",
          alignSelf: "center",
          marginBottom: "10px",
        }}
        onClick={handleLogout}
      >
        {/* <LogoutIcon style={{ color: "black" }} /> */}
        Logout
      </button>
      <button
        className="button"
        style={{
          // marginLeft: 'auto',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // width: "100px",
          marginTop: "auto",
          alignSelf: "center",
          marginBottom: "10px",
        }}
        onClick={() => setAdd(!add)}
      >
        {/* <LogoutIcon style={{ color: "black" }} /> */}
        Create PPT
      </button>

      {add && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="form-container">
              {/* <h1>Upload PPT</h1> */}
              <form className="school-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="Enter or select category"
                    onChange={handleChangeInput}
                    value={formData.category}
                  />
                </div>

                {showSuggestions && filteredCategories.length > 0 && (
                  <ul
                    style={{
                      border: "1px solid #ccc",
                      marginTop: "5px",
                      padding: "0",
                      listStyle: "none",
                      maxHeight: "150px",
                      overflowY: "auto",
                      minWidth: "100px",
                      maxWidth: "200px",
                    }}
                  >
                    {filteredCategories.map((category, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectCategory(category)}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff")
                        }
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter Title"
                    onChange={handleChangeInput}
                    value={formData.title}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter Description"
                    onChange={handleChangeInput}
                    value={formData.description}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ppt">Upload PPT</label>
                  <input
                    type="file"
                    id="ppt"
                    name="ppt"
                    onChange={handleChangeInput}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="thumbnail">Upload Thumbnail</label>
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    onChange={handleChangeInput}
                  />
                  <img
                    src={selectedImage}
                    alt=" "
                    style={{ width: "300px", height: "200px" }}
                    className="thumbnail"
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="submit-btn">
                    Create
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => handleCancel()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pptList?.length > 0 &&
              pptList.map((ppt: any, index) =>
                ppt.items.map((item: any, itemIndex: number) => (
                  <tr key={`${index}-${itemIndex}`}>
                    <td>{item.title}</td>
                    <td>{ppt.title}</td>
                    <td>{item.description}</td>
                    <td style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item, ppt.title, ppt._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="button"
                        style={{ padding: "8px", fontSize: "12px" }}
                        onClick={() => handleUpload(item._id)}
                      >
                        Upload video
                      </button>
                      <button
                        className="button"
                        style={{ padding: "8px", fontSize: "12px" }}
                        onClick={() =>
                          handleAssessmentClick(item._id, item.title)
                        }
                      >
                        Add Assessment
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>

      {uploadOpen && (
        <UploadVideoPopup open={uploadOpen} id={id} setOpen={setUploadOpen} />
      )}
    </DashboardContainer>
  );
};
