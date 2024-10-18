"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import useModal from "@/app/hooks/useModal";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import FormErrors from "./FormErrors";
import Image from "next/image";

type FormData = {
  title: string;
  file: File;
};

type AttachedFile = {
  name:string;
  type:string;
}|null;


function FileUploadButton() {
  const { isOpen, openModal, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    resetField
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [attachedFile,setAttachedFile] = useState<AttachedFile>(null);

  const isValidFileSize = (bytes: number) => {
    const fileSizeMB = bytes / (1024 * 1024);
    if (fileSizeMB > 2) {
      return false;
    }
    console.log(fileSizeMB);
    return true;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ele = e.target;
    if (ele.files && ele.files.length > 0) {
      const selectedFile = ele.files[0];
      if (
        selectedFile &&
        ![
          ".pdf",
          "application/pdf",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ].includes(selectedFile.type)
      ) {
        setError("file", {
          type: "invalidType",
          message:
            "Please upload a valid file type: PDF or PowerPoint(.ppt,.pptx)",
        });
      } else {

        const numberOfBytes = selectedFile.size;
        console.log(selectedFile.name,selectedFile.type);
        setAttachedFile({name:selectedFile.name,type:selectedFile.type});
        if (!isValidFileSize(numberOfBytes)) {
          setError("file", {
            type: "invalidSize",
            message: "File size is greater than 2MB.",
          });

          setAttachedFile(null);
        }
      }
    }
    
  };

  const formSubmit = async (data: FormData) => {
    setLoading(true);
    console.log(data);
    try {

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setAttachedFile(null);
    reset();
    closeModal();
  };

  const handleFileRemove = ()=>{
    setAttachedFile(null);
    resetField("file");
  }

  return (
    <>
      <Button
        variant={"default"}
        aria-label="Upload a new presentation"
        onClick={openModal}
        className="bg-cyan-700 flex gap-2 hover:bg-cyan-600 "
      >
        <Upload className="size-4 sm:size-6" />
        <span className="hidden sm:block">Upload Presentation</span>
      </Button>
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <form
          onSubmit={handleSubmit(formSubmit)}
          aria-label="file-upload-form "
          className="rounded-xl px-4 py-2 bg-white flex-col w-full min-w-60 max-w-md  sm:w-2/4 sm:max-w-md"
        >
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-base sm:text-lg font-medium ">
              Upload Presentation
            </h2>
            <Button
              type="button"
              variant={"ghost"}
              className="rounded-full hover:bg-cyan-100"
              size={"icon"}
              onClick={handleClose}
            >
              <X></X>
            </Button>
          </div>
          <div className="flex-col items-center ">
            <div className="my-2">
              <label htmlFor="text-input">
                Title<sup className="text-red-500">*</sup>
              </label>
              <Input
                type="text"
                id="title-input"
                className="block"
                required={true}
                {...register("title", {
                  minLength: {
                    value: 4,
                    message: "Title should be atleast 4 characters long",
                  },
                })}
                disabled={loading}
                aria-disabled={loading}
              />
              {errors.title?.message && (
                <FormErrors message={errors.title.message} />
              )}
            </div>
            <div className="my-3">
              <label
                htmlFor="file-input"
                className="block max-w-max font-medium text-white bg-cyan-700 p-2 rounded-lg hover:bg-cyan-800"
              >
                Choose File
              </label>
              <Input
                type="file"
                id="file-input"
                accept=""
                className="hidden "
                {...register("file",{required:{value:true,message:"Please upload a file"}})}
                aria-describedby="file-input-help"
                onChange={onFileChange}
                disabled={loading}
                aria-disabled={loading}
              />
              <span
                id="file-input-help"
                className="block text-xs text-gray-500"
              >
                Max File Size: 2MB {"(.pdf,.pptx)"}
                <sup className="text-red-500">*</sup>
              </span>
              {errors.file?.message && (
                <FormErrors message={errors.file.message} />
              )}
            </div>
            {
             attachedFile && <div className="w-full py-2 px-4 flex justify-between items-center my-2 rounded-lg border border-dotted border-gray-300">
                <div className="col-span-1">
                  <Image src={["application/pdf",".pdf"].includes(attachedFile.type)?"/pdf.svg":"/ppt.svg"} alt="file icon" width={28} height={28}/>
                </div>
                <div className="col-span-2 min-w-0 flex-shrink-1 flex-grow-0">
                  <span className="text-sm text-gray-600 block whitespace-nowrap overflow-hidden overflow-ellipsis ">{
                    attachedFile.name
                  }</span>
                </div>
                <div className="col-span-1 " onClick={handleFileRemove}><X size={20}></X></div>
             </div> 
            }

            <div>
              <Button
                variant={"default"}
                type="submit"
                aria-label="Submit the form"
                className="mx-auto bg-cyan-700 flex gap-2 hover:bg-cyan-800 "
                disabled={loading}
                aria-disabled={loading}
              >
                <Upload className="size-4 " />
                <span className="block">Upload </span>
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default FileUploadButton;
