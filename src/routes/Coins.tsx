import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";

const Container = styled.div`
    padding: 10px;
    max-width: 500px;
    margin: 0 auto;
`;


const Title = styled.h1`
    color: ${props => props.theme.textColor};
    font-size: 48px;
    font-weight: 900;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: ${props => props.theme.textColor};
    color: ${props => props.theme.bgColor};
    margin-bottom: 10px;
    border-radius: 16px;

    a {
        transition: color .2s ease;
        display: flex;
        padding: 20px;
        align-items: center;
    }

    &:hover {
        a {
            color: ${props => props.theme.pointColor}
        }
    }
`;

const Img = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 8px;
`;

const Loading = styled.span`
    display: block;
    text-align: center;
    width: 100%;
    margin-top: 80px;
`;

interface ICoin {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string
}

const Coins = () => {
    /*const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState<ICoin[]>([]);

    useEffect(() => {
        (async() => {
            const json = await(await fetch("https://api.coinpaprika.com/v1/coins")).json();
            setCoins(json.slice(0, 100));
            setLoading(false);
        })();
    }, []);*/

    const {isLoading, data} = useQuery<ICoin[]>("allCoins", fetchCoins);
    
    return (
        <Container>
            <Header>
                <Title>Coins</Title>
            </Header>
        {
            isLoading
                ? (
                    <Loading>Loading...</Loading>
                )
                : (
                    <CoinsList>
                        {
                            data?.slice(0,100).map(({id, name, symbol}) => {
                                return(
                                    <Coin key={id}>
                                        <Link to={`/${id}`} state={{name:`${name}`}}>
                                            <Img src={`https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`} alt={`${name} symbol`} />
                                            {name} &rarr;
                                        </Link>
                                    </Coin>
                                )
                            })
                        }
                    </CoinsList>
                )
        }
        </Container>
    )
};

export default Coins;