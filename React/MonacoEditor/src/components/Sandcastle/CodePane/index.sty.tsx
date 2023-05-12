import styled from "styled-components"

export const Box = styled.div`
    height: 100%;
    width: 600px;
    border-right: 5px solid blueviolet;
`;

export const ActionBox = styled.div`
    position: sticky;
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    background: #000;
    button {
        margin-right: 20px;
    }
`;