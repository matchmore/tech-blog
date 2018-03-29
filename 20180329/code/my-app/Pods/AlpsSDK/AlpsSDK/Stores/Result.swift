//
//  Result.swift
//  AlpsSDK
//
//  Created by Maciej Burda on 14/11/2017.
//  Copyright © 2018 Matchmore SA. All rights reserved.
//

/// Result represents async response from the server. It can be either success or failure using internal enum values to represent response data.
public enum Result<T> {
    case success(T)
    case failure(ErrorResponse?)
    
    /// Convenience accessor to succesful response object.
    public var responseObject: T? {
        guard case let .success(responseObject) = self else { return nil }
        return responseObject
    }
    
    /// Convenience accessor to failure error messeage.
    public var errorMessage: String? {
        guard case let .failure(error) = self else { return nil }
        return error?.message
    }
}
