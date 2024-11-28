"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";



type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div 
            {...getRootProps()} 
            className="file-upload flex justify-center items-center border-2 border-dashed border-gray-400 p-6 rounded-lg hover:border-green-500 hover:bg-gray-800"
            style={{ minHeight: '200px', position: 'relative' }} // Ensures minimum height for the area
        >
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image
                    src={convertFileToUrl(files[0])}
                    width={1000}
                    height={1000}
                    alt="uploaded image"
                    className="max-h-[400px] max-w-[100%] overflow-hidden object-cover"
                />
            ) : (
                <>
                    <Image
                        src="/assets/icons/upload.svg"
                        width={40}
                        height={40}
                        alt="upload"
                    />
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-700">
                            <span className="text-green-500">Click to upload </span>
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
