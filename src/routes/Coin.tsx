import { useQuery } from "react-query";
import { Link, Outlet, Params, useLocation, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import {Helmet} from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
    padding: 10px;
    max-width: 500px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: space-between;
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
    background-color: ${props => props.theme.black};
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

const LinkWrap = styled.div`
    width: 100%;
    display: flex;
    margin-top: 20px;
    background-color: ${props => props.theme.black};
    border-radius: 10px 10px 0 0;
    overflow: hidden;
`;

interface ISLink {
    isacctive: boolean;
}

const SLink = styled(Link)<ISLink>`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    height: 32px;

    background-color: ${props => props.isacctive ? props.theme.pointColor : props.theme.black};

    &:first-child {
        border-right: 1px solid ${props => props.theme.bgColor};
    }

    &.on {
        background-color: ${props => props.theme.pointColor};
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
    const priceMatch = useMatch("/:coinId/price");
    const chartMatch = useMatch("/:coinId/chart");

    const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId));
    const {isLoading: tickerLoading, data: tickerData} = useQuery<PriceData>(["ticker", coinId], () => fetchCoinTickers(coinId), {refetchInterval: 1000});

    const loading = infoLoading || tickerLoading;

    const setterFn = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () =>setterFn(prev => !prev);

    return (
        <Container>
            <Helmet>
                <title>{state ? state?.name : loading ? "Loading" : infoData?.name}</title>
            </Helmet>
            <Header>
                <Title>{state ? state?.name : loading ? "Loading" : infoData?.name}</Title>
                <button onClick={toggleDarkAtom}>Toggle Mode</button>
            </Header>
            {
                loading
                ? <p>Loading...</p>
                : (
                    <DataWrap>
                        <Info>
                            <li>
                                <h4>RANK:</h4>
                                <p>{infoData?.rank}</p>
                            </li>
                            <li>
                                <h4>SYMBOL:</h4>
                                <p>$ {infoData?.symbol}</p>
                            </li>
                            <li>
                                <h4>PRICE:</h4>
                                <p>{tickerData?.quotes.USD.price.toFixed(3)}</p>
                            </li>
                        </Info>
                        <Discription>{infoData?.description}</Discription>
                        <Info>
                            <li>
                                <h4>TOTAL SUPLY:</h4>
                                <p>{tickerData?.total_supply}</p>
                            </li>
                            <li>
                                <h4>MAX SUPPLY:</h4>
                                <p>{tickerData?.max_supply}</p>
                            </li>
                        </Info>
                        <LinkWrap>
                            <SLink to="./chart" isacctive={chartMatch !== null}>Chart</SLink>
                            <SLink to="./price" isacctive={priceMatch !== null}>Price</SLink>
                        </LinkWrap>
                        <Outlet context={{coinId: coinId}} />
                    </DataWrap>
                )
            }
        </Container>
    )
};

export default Coin;