import { useEffect, useState } from "react";
import { Params, Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
    padding: 10px;
    max-width: 500px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 900;
`;

const Title = styled.h1`
    color: ${props => props.theme.textColor};
    font-size: 48px;
    color: ${props => props.theme.pointColor};
`;

const DataWrap = styled.div`
    margin: 20px 0;
`;

const Info = styled.ul`
    background-color: #001122;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-radius: 16px;

    li {
        display: flex;
        flex-direction: column;
        align-items: center;

        h4 {
            font-size: 12px;
            line-height: 12px;
            opacity: .5;
        }

        p {
            font-size: 24px;
            line-height: 24px;
            margin-top: 8px;
            font-weight: 900;
        }
    }
`;

const Discription = styled.p`
    margin: 20px 8px;
`;

interface RouteParams extends Params {
    coinId: string;
}

interface RouteState {
    state: {
        name: string;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    contract: string;
    platform: string;
    description: string;
    message: string;
    open_source: boolean;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_a: string;
}

interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        }
    };
}

const Coin = () => {
    const {coinId} = useParams() as RouteParams;
    const {state} = useLocation() as RouteState;
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();

    useEffect(() => {
        (
            async () => {
                const infoData = await( await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
                const priceData = await( await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
                setInfo(infoData);
                setPriceInfo(priceData);
                setLoading(false);
            }
        )();
    }, [coinId]);

    console.log(info, priceInfo);

    return (
        <Container>
            <Header>
                <Title>{state ? state?.name : loading ? "Loading" : info?.name}</Title>
            </Header>
            {
                loading
                ? <p>Loading...</p>
                : (
                    <DataWrap>
                        <Info>
                            <li>
                                <h4>RANK:</h4>
                                <p>{info?.rank}</p>
                            </li>
                            <li>
                                <h4>SYMBOL:</h4>
                                <p>$ {info?.symbol}</p>
                            </li>
                            <li>
                                <h4>OPEN SOURCE:</h4>
                                <p>{info?.open_source ? "Yes" : "No"}</p>
                            </li>
                        </Info>
                        <Discription>{info?.description}</Discription>
                        <Info>
                            <li>
                                <h4>TOTAL SUPLY:</h4>
                                <p>{priceInfo?.total_supply}</p>
                            </li>
                            <li>
                                <h4>MAX SUPPLY:</h4>
                                <p>{priceInfo?.max_supply}</p>
                            </li>
                        </Info>
                        <Routes>
                            <Route path="chart" element={<Price />}/>
                            <Route path="price" element={<Chart />}/>
                        </Routes>
                    </DataWrap>
                )
            }
        </Container>
    )
};

export default Coin;