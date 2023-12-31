import React from "react"
import { gql , useQuery } from "@apollo/client"
import ThreeDots from "react-loader-spinner"
import {format , parseISO} from "date-fns"

import "./index.css"

interface BeforeFetchingData {
    __typename: string
    id: string
    launch_date_utc:string
    links: {
        __typename: string
        article_link: string
        video_link: string
    }
    mission_name: string
    rocket: {
        __typename: string
        rocket_name: string
    }
}
interface LaunchDataType {
    missionName: string
    launchDate: string
    articleLink: string
    videoLink: string
    rocketName: string
    id: string
}
const variables = {offset: 0 , limit: 10}

const Home = () => {
    const LAUNCH_DATES = gql`
    query launch_dates($offset: Int , $limit: Int) {
        launchesPast(offset: $offset , limit: $limit)  {
            mission_name
            launch_date_utc
            rocket {
                rocket_name
            }
            links {
                article_link
                video_link
            }
            id
        }
    }
    `
    const {data , loading , fetchMore} = useQuery(LAUNCH_DATES , {variables})
    const fetchNextPage = ({currentTarget}) => {
        if (currentTarget.scrollTop + currentTarget.clientHeight >= currentTarget.scrollHeight) {
            if (data.launchesPast.length < variables.limit) {
                return
            }
            fetchMore({
                variables: {
                    offset: data.launchesPast.length,
                    limit: data.launchesPast.length + 10
                },
                updateQuery: (prevResult , {fetchMoreResult}) => {
                    if (!fetchMoreResult) return prevResult
                    const newData = {
                        ...prevResult ,
                        launchesPast: [...prevResult.launchesPast , ...fetchMoreResult.launchesPast]
                    }
                    return newData
                }
            })
        }
    }
    const renderLaunchData = () => {
        if (data) {
            const launchData: LaunchDataType[] = data.launchesPast.map((each: BeforeFetchingData) => {
                return ({
                    missionName: each.mission_name , 
                    launchDate: each.launch_date_utc ,
                    articleLink: each.links.article_link ,
                    videoLink: each.links.video_link ,
                    rocketName: each.rocket.rocket_name ,
                    id: each.id
                })
            })
            return (
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                Mission Name
                            </th>
                            <th>Launch Date</th>
                            <th>Rocket</th>
                            <th>Article URL</th>
                            <th>Video URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {launchData.map((each: LaunchDataType) => (
                            <tr key = {each.id}>
                                <td>{each.missionName}</td>
                                <td>{format(parseISO(each.launchDate), "d MMM, h:mm aa")}</td>
                                <td>{each.rocketName}</td>
                                <td>
                                    <a style = {{textDecoration: "none" }} href={`${each.articleLink}`} target="_blank" rel="noreferrer">{each.missionName } Article Link</a>
                                </td>
                                <td>
                                    <a style = {{textDecoration: "none" }} href = {`${each.videoLink}`} target="_blank" rel="noreferrer">{each.missionName}  Video Link</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
        if (loading) {
            return (<div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "13"
                }}
                className="loader-container"
              >
                <ThreeDots
                  height="80"
                  width="80"
                  radius={9}
                  color="#4D78FF75"
                  type="ThreeDots"
                  visible={true}
                />
              </div>)
        }
    }
    return (
        <div className="background"  onScroll={e => fetchNextPage(e)}>
            <div className="table-card">
                {renderLaunchData()}
            </div>
        </div>
    )
}

export default Home