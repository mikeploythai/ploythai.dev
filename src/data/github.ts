import { Octokit } from "@octokit/core";

import { getCurrentMonth } from "@/lib/current-month";

import { env } from "cloudflare:workers";

const github = new Octokit({ auth: env.GITHUB_PAT });

type Repos = {
	viewer: {
		repositories: {
			nodes: {
				name: string;
				nameWithOwner: string;
				description: string | null;
				url: string;
				isFork: boolean;
				stargazerCount: number;
				forkCount: number;
				languages: {
					totalSize: number;
					edges: {
						size: number;
						node: { name: string; color: string | null };
					}[];
				};
			}[];
		};
	};
};

export const getRepos = async ({ per_page = 6 }: { per_page?: number }) => {
	const {
		viewer: {
			repositories: { nodes: repos },
		},
	} = await github.graphql<Repos>(
		`query ($first: Int!) {
			viewer {
				repositories(
					first: $first
					ownerAffiliations: [OWNER]
					privacy: PUBLIC
					orderBy: { field: PUSHED_AT, direction: DESC }
				) {
					nodes {
						name
						nameWithOwner
						description
						url
						isFork
						stargazerCount
						forkCount
						languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
							totalSize
							edges {
								size
								node {
									name
									color
								}
							}
						}
					}
				}
			}
		}`,
		{ first: per_page },
	);

	return repos.map(
		({
			name,
			nameWithOwner,
			description,
			url,
			isFork,
			stargazerCount,
			forkCount,
			languages,
		}) => ({
			name,
			full_name: nameWithOwner,
			description,
			html_url: url,
			fork: isFork,
			stargazers_count: stargazerCount,
			forks_count: forkCount,
			languages: languages.edges.map(({ size, node }) => ({
				...node,
				size,
				percentage: (size / languages.totalSize) * 100,
			})),
		}),
	);
};

type Profile = {
	viewer: {
		url: string;
		avatarUrl: string;
		contributionsCollection: {
			contributionCalendar: {
				totalContributions: number;
				weeks: {
					contributionDays: {
						date: string;
						weekday: number;
						contributionCount: number;
						contributionLevel: string;
					}[];
				}[];
			};
		};
	};
};

export const getProfile = async () => {
	const { start, end } = getCurrentMonth();
	const { viewer: profile } = await github.graphql<Profile>(
		`query ($from: DateTime!, $to: DateTime!) {
		viewer {
			url
			avatarUrl(size: 135)
			contributionsCollection(from: $from, to: $to) {
				contributionCalendar {
					totalContributions
					weeks {
						contributionDays {
							date
							weekday
							contributionCount
							contributionLevel
						}
					}
				}
			}
		}
	}`,
		{ from: start, to: end },
	);

	return profile;
};
