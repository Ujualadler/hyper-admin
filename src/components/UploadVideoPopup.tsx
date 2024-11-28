import { useState } from "react";
import { toast } from "react-toastify";
import { API_CLIENT } from "../util/ApiClient";
import HLSPlayer from "./VideoPlayer";
import { API_URL } from "../config";
import CloseIcon from '@mui/icons-material/Close';

interface IVFormDataType {
    id: string,
    video: Array<any>;
    name: string;
}
interface PropsType {
    open: boolean,
    id: string;
    setOpen: any;
}

const markers = [
    {
        startTime: 3,
        endTime: 15,
        label: 'First Marker',
        top: 20,
        left: 30,
        snapshot: ""
    },
    {
        startTime: 10,
        endTime: 35,
        label: 'Second Marker',
        top: 50,
        left: 50,
        snapshot: ""

    },
    {
        startTime: 18,
        endTime: 50,
        label: 'Third Marker',
        top: 10,
        left: 80,
        snapshot: ""

    },
];



export const UploadVideoPopup = ({ open, id, setOpen }: PropsType) => {
    const [videoFormData, setVideoFormData] = useState<IVFormDataType>({
        id: id,
        video: [],
        name: "",
    });
    const [isUploading, setUploading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");
    const notify = (message: string) => toast(message)
    const [videoId, setId] = useState<string>("");

    const handleUploadVideo = async (e: any) => {
        e.preventDefault();
        setUploading(true);
        if(!videoFormData.name) {
          notify("Please enter video name");
          return;
        };
        if (!videoFormData.video.length) {
            notify('Please choose a video');
            return;
        }
        const newFormData = new FormData();
        newFormData.append("id", videoFormData.id);
        newFormData.append("name", videoFormData.name);
        videoFormData.video.map((video) => newFormData.append("video", video));

        try {
            const { data } = await API_CLIENT.post('/api/video/upload', newFormData);
            setUploading(false);
            setUrl(data.url);
            setId(data?.id);
            notify(data?.message);
        } catch (e: any) {
            setUploading(false);
            notify('Error while uploading');
        }

        return;
    }

    const handleChooseVideo = (e: any) => {
        const { name, value, files } = e.target;
        if (name === "video") {
            setVideoFormData((prev) => ({
                ...prev,
                [name]: [files[0]],
            }))
        } else {
            setVideoFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleClose = (e: any) => {
        e.preventDefault();
        setOpen(!open)
    }

    

    return (
        <>
            {
                open &&
                <div className="popup-overlay">
                    <div className="popup" style={{ width: 'fit-content' }}>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <CloseIcon style={{ marginLeft: 'auto', marginBottom: '10px', cursor: 'pointer',  }} onClick={handleClose} />
                        </div>
                        {
                            url ? <>
                                <HLSPlayer videoUrl={`${API_URL}/api/video/stream?key=${url}`} markers={markers} id={videoId} />
                                
                            </>
                                : <div className="form-container">
                                    <form className="school-form" onSubmit={handleUploadVideo}>

                                        <div className="form-group">
                                            <label htmlFor="ppt">Choose Video</label>
                                            <input
                                                type="file"
                                                id="video"
                                                name="video"
                                                onChange={handleChooseVideo}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Enter video name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={videoFormData.name}
                                                onChange={handleChooseVideo}
                                            />
                                        </div>

                                        <div style={{ display: "flex", justifyContent: 'end', gap: '20px' }}>
                                            <button className="delete-btn" onClick={(e) => handleClose(e)}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="button">
                                                { isUploading ? "Uploding..." : "Submit" }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                        }

                    </div>
                </div>
            }
        </>
    )
}