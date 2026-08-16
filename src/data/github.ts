import { Octokit } from "@octokit/core";

import { env } from "cloudflare:workers";

const github = new Octokit({ auth: env.GITHUB_PAT });

export const getRepos = async ({
	per_page,
	page,
}: {
	per_page?: number;
	page?: number;
}) => {
	const { data: repos } = await github.request("GET /user/repos", {
		visibility: "public",
		affiliation: "owner",
		sort: "pushed",
		direction: "desc",
		per_page,
		page,
	});

	return repos.map(
		({ name, full_name, description, html_url, fork, language }) => ({
			name,
			full_name,
			description,
			html_url,
			fork,
			language,
		}),
	);
};
