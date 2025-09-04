import { RequestType } from "@/types/http-request";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Session from "./session";

export const GET = <T = unknown>(
    url: string,
    req?: any
): Promise<AxiosResponse<T, any>> => {
    let config: AxiosRequestConfig = {
        method: RequestType.Get,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            Authorization: `Bearer ${Session.getToken()}`,
        },
        data: req
    };

    return axios<T>(config)
}

export const POST = <T = unknown>(
    url: string,
    req?: any
): Promise<AxiosResponse<T, any>> => {
    let config: AxiosRequestConfig = {
        method: RequestType.Post,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            Authorization: `Bearer ${Session.getToken()}`,
        },
        data: req
    };

    return axios<T>(config)
}

export const EDIT = <T = unknown>(
    url: string,
    req?: any
): Promise<AxiosResponse<T, any>> => {
    let config: AxiosRequestConfig = {
        method: RequestType.Edit,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            Authorization: `Bearer ${Session.getToken()}`,
        },
        data: req
    };

    return axios<T>(config)
}

export const PATCH = <T = unknown>(
    url: string,
    req?: any
): Promise<AxiosResponse<T, any>> => {
    let config: AxiosRequestConfig = {
        method: RequestType.Patch,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            Authorization: `Bearer ${Session.getToken()}`,
        },
        data: req
    };

    return axios<T>(config)
}

export const DELETE = <T = unknown>(
    url: string,
    req?: any
): Promise<AxiosResponse<T, any>> => {
    let config: AxiosRequestConfig = {
        method: RequestType.Delete,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            Authorization: `Bearer ${Session.getToken()}`,
        },
        data: req
    };

    return axios<T>(config)
}