import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import styled from "styled-components";

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
    const {coinId} = useOutletContext<IChart>();
    const endDate = Math.floor(Date.now() / 1000);
    const startDate = endDate - 60*60*24*29;
    const date = `start=${startDate}&end=${endDate}`;

    const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId, date));

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
                                return Math.round(coin.close);
                            })??[]
                        }
                    ]}
                    options={{
                        chart: {
                            height: 500,
                            width: 500,
                            foreColor: "#fff",
                        },
                        tooltip: {
                            theme: "dark"
                        }
                    }}
                />
            }
        </Container>
    )
}

export default Chart;