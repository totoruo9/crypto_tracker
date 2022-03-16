import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IChart {
    coinId: string;
}

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

const Container = styled.div`
    padding: 16px 8px;
`;

function Chart() {
    const isDark = useRecoilValue(isDarkAtom);
    const {coinId} = useOutletContext<IChart>();
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - 60*60*24*29;
    const date = `start=${startDate}&end=${endDate}`;

    const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId, date), {refetchInterval:10000});

    return (
        <Container>
            {
                isLoading ? "Loading chart..."
                : <ApexChart
                    type="line"
                    series={[
                        {
                            name: coinId,
                            data: data?.map(coin => {
                                return coin.close;
                            })??[]
                        }
                    ]}
                    options={{
                        chart: {
                            height: 500,
                            width: 500,
                            foreColor: "#fff",
                            toolbar: {
                                show: false
                            }
                        },
                        grid: {
                            show: false
                        },
                        tooltip: {
                            theme: isDark ? "dark" : "light",
                            y: {
                                formatter: value => `$ ${value.toFixed(3)}`
                            }
                        },
                        stroke: {
                            curve: "smooth",
                            width: 2,
                        },
                        yaxis: {
                            show: false
                        },
                        xaxis: {
                            labels: {
                                show: false
                            },
                            axisBorder: {
                                show: false
                            },
                            axisTicks: {
                                show: false
                            },
                            type:"datetime",
                            categories: data?.map(date => date.time_close)
                        },
                        fill: {
                            type: "gradient",
                            gradient: {
                                gradientToColors: ["red"],
                                stops: [0, 100]
                            }
                        },
                        colors: ["blue"]
                    }}
                />
            }
        </Container>
    )
}

export default Chart;