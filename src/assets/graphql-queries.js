module.exports = {
    userQuery: `query($name: String, $id: Int) {
        User(name: $name, id: $id) {
            id
            name
            avatar {
                large
                medium
            }
            bannerImage
            options {
                profileColor
            }
            favourites {
                anime {
                    nodes {
                        id
                        siteUrl
                        title {
                            romaji
                            english
                            native
                            userPreferred
                        }
                        type
                    }
                }
                manga {
                    nodes {
                        id
                        siteUrl
                        title {
                            romaji
                            english
                            native
                            userPreferred
                        }
                        type
                    }
                }
                characters {
                    nodes {
                        id
                        siteUrl
                        name {
                            english: full
                        }
                    }
                }
                staff {
                  nodes {
                    id
                    siteUrl
                    name {
                      english: full
                    }
                  }
                }
                studios {
                  nodes {
                    id
                    siteUrl
                    name
                  }
                }
            }
            siteUrl
            donatorTier
            donatorBadge
            moderatorRoles
            updatedAt
            statistics {
                anime {
                    count
                    meanScore
                    standardDeviation
                    minutesWatched
                    episodesWatched
                    formats(sort: COUNT_DESC) {
                        count
                        format
                    }
                    statuses(sort: PROGRESS) {
                        count
                        status
                    }
                    releaseYears(sort: COUNT_DESC) {
                        count
                        releaseYear
                    }
                    genres(sort: COUNT_DESC) {
                        count
                        genre
                        meanScore
                        minutesWatched
                    }
                }
                manga {
                    count
                    meanScore
                    standardDeviation
                    chaptersRead
                    volumesRead
                    formats(sort: COUNT_DESC) {
                        count
                        format
                    }
                    statuses(sort: PROGRESS) {
                        count
                        status
                    }
                    releaseYears(sort: COUNT_DESC) {
                        count
                        releaseYear
                    }
                    genres(sort: COUNT_DESC) {
                        count
                        genre
                        meanScore
                        chaptersRead
                    }
                }
            }
        }
    }`,
    userActivity: `query ($user: Int) {
        Page(page: 1, perPage: 5) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          activities(userId: $user, sort: ID_DESC) {
            ... on ListActivity {
              id
              status
              type
              createdAt
              progress
              media {
                id
                siteUrl
                title {
                  romaji
                  english
                  userPreferred
                }
                type
              }
              createdAt
            }
          }
        }
      }`,
};