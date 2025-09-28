import React, { useState } from "react";
import Dropzone, { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

interface UploadFileProps {
  onUpload: (fileUrl: string) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (acceptedFiles: File[]) => {
    console.log("logging drop/selected file", acceptedFiles);
    const url = "https://api.escuelajs.co/api/v1/files/upload";
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          setFile(acceptedFiles[0]);
          onUpload(data.location);
        } else {
          console.error("Failed to upload file");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="main-container">
      <Dropzone onDrop={handleUpload} accept={{ 'image/*': [] }} minSize={1024} maxSize={3072000}>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

          return (
            <div
              {...getRootProps({
                className: `dropzone ${additionalClass}`,
              })}
            >
              <input {...getInputProps()} />
              <div className="relative w-full h-80 border-2 border-dashed border-black p-5"><p className="absolute font-bold text-xl"> Ấn vào đây để thêm ảnh </p></div>
            </div>
          );
        }}
      </Dropzone>
      {file && (
        <>
          <h4>File Uploaded Successfully !!</h4>
          <img src={URL.createObjectURL(file)} className="img-container" alt="Uploaded file" />
        </>
      )}
    </div>
  );
};

export default UploadFile;
