import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_CLIENT, API_URL } from "../util/ApiClient";
import { User } from "../types/user";
import { createStudyMaterial } from "../service/StudyMaterialService";

interface CreateContentProps {
  onClose: () => void;
}

interface CreateContentForm {
  title: string;
  standard: string;
  subjects: string;
  chapters: string;
  teachers: string;
  files: File[];
}

export const CreateContentPopup: React.FC<CreateContentProps> = ({
  onClose,
}) => {
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const [formData, setFormData] = useState<CreateContentForm>({
    title: "",
    standard: "",
    subjects: "",
    chapters: "",
    teachers: "",
    files: [],
  });

  useEffect(() => {
    fetchData("classes", "");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //
    try {
      e.preventDefault();
      const newFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "files") {
          (value as File[]).forEach((file) => {
            newFormData.append("files", file);
          });
        } else {
          newFormData.append(key, value);
        }
      });
      console.log(newFormData);
      const response = await createStudyMaterial(newFormData);
      if (response) {
        onClose();
        alert(response.message);
      }
    } catch (e) {
      alert("error");
    }
  };

  const fetchData = async (type: string, value: string) => {
    if (type === "classes") {
      const data = await API_CLIENT.get(
        `/api/list/${type}?name=${value}&id=${value}`
      );
      setClassList(data?.data?.data);
    } else if (type === "subjects") {
      const data = await API_CLIENT.get(
        `/api/list/${type}?name=${value}&id=${value}`
      );
      setSubjectList(data?.data?.data);
    } else if (type === "chapters") {
      const data = await API_CLIENT.get(
        `/api/list/${type}?name=${value}&id=${value}&standard=${formData?.standard}`
      );
      setChapterList(data?.data?.data);
    } else if (type === "teachers") {
      const data = await API_CLIENT.get(
        `/api/list/${type}?name=${value}&id=${value}`
      );
      console.log(data);
      setTeacherList(data?.data?.data);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      console.log("files", files);
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      if (name === "standard") {
        fetchData("subjects", value);
      } else if (name === "subjects") {
        fetchData("chapters", value);
      } else if (name === "chapters") {
        fetchData("teachers", value);
      }
      console.log("name, value", name, value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Create content</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Select file</label>
            <input type="file" multiple name="files" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="class">Class</label>
            <select
              name="standard"
              onChange={(e) => handleChange(e)}
              value={formData.standard}
              className="custom-select"
            >
              <option value="">Select class</option>
              {classList.length > 0 &&
                classList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subjects">Subjects</label>
            <select
              name="subjects"
              onChange={(e) => handleChange(e)}
              value={formData.subjects}
              className="custom-select"
            >
              <option value="">Select subject</option>
              {subjectList.length > 0 &&
                subjectList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chapters">Chapters</label>
            <select
              name="chapters"
              onChange={(e) => handleChange(e)}
              value={formData.chapters}
              className="custom-select"
            >
              <option value="">Select chapter</option>
              {chapterList.length > 0 &&
                chapterList.map((item: any, index) => (
                  <option key={index} value={item.ChpID}>
                    {item.Chapter}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="teachers">Teachers</label>
            <select
              name="teachers"
              onChange={(e) => handleChange(e)}
              value={formData.teachers}
              className="custom-select"
            >
              <option value="">Select teacher</option>
              {teacherList.length > 0 &&
                teacherList.map((item: User, index) => (
                  <option key={index} value={item.userEmail}>
                    {item.userName}
                  </option>
                ))}
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Create
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
