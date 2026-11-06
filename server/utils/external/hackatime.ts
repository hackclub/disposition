const config = useRuntimeConfig();

async function call<T>(token: string, path: string, params?: Record<string, string>): Promise<T> {
    return $fetch<T>(`https://hackatime.hackclub.com/api/v1/${path}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },

        query: params ?? undefined
    })
}

// where tf would i store the launch date..? anyways...
// TODO: add ?since=LAUNCH_DATE
export type HackatimeTrustFactor = {
    trust_level: "green" | "blue" | "red";
    trust_value: number;
};

export async function getTrustFactor(slackId: string): Promise<HackatimeTrustFactor | null> {
    try {
        return await $fetch<HackatimeTrustFactor>(
            `https://hackatime.hackclub.com/api/v1/users/${encodeURIComponent(slackId)}/trust_factor`
        );
    } catch (error: any) {
        if ((error?.statusCode ?? error?.response?.status) === 404) return null;
        throw error;
    }
}

export type HackatimeProject = {
    projects: {
        name: string;
        total_seconds: number;
        most_recent_heartbeat: string;
        languages: string[];
        archived: boolean;
    }[];
}

export async function getProjects(token: string): Promise<HackatimeProject> {
    return call<HackatimeProject>(token, "authenticated/projects", {
        since: config.public.startDate.now()
    });
}

export type HackatimeProjectDetails = {
    name: string,
    total_seconds: number,
    languages: string[],
    repo_url: string,
    total_heartbeats: number,
    first_heartbeat: string,
    last_heartbeat: string,
    most_recent_heartbeat: string,
    archived: boolean
}

export async function getProjectDetails(token: string, project: string, slackId: string, since?: Date): Promise<HackatimeProjectDetails> {
    return call<HackatimeProjectDetails>(token, `users/${encodeURIComponent(slackId)}/project/${encodeURIComponent(project)}`, {
        start: since? since : config.public.startDate
    });
}