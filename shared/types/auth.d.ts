declare module '#auth-utils' {
    interface User {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        slackId: string,
        yswsEligible: boolean,
        verificationStatus: string,

        birthday?: Date,
        legalFirstName?: string,
        legalLastName?: string,
        phoneNumber?: string,
        addresses?: {
            id: string,
            firstName: string,
            lastName: string,
            line1: string,
            line2: string,
            city: string,
            state: string,
            postalCode: string,
            country: string,
            phoneNumber: string,
            primary: boolean
        }[]
    }

    interface UserSession {
        // Add your own fields
    }

    interface SecureSessionData {
        hcRefreshToken: string
    }
}

export { }