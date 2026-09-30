declare module '#auth-utils' {
    interface User {
        id: string,
        name: string,
        email: string,
        slackId: string,
        yswsEligible: boolean,
        verificationStatus: string
    }

    interface UserSession {
        // Add your own fields
    }

    interface SecureSessionData {
        hcRefreshToken: string
    }
}

export { }