

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const AccountContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const AccountContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccountCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
`;

const Title = styled.h2`
  color: #333;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #555;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #c82333;
  }
`;

const MyAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login"); // optional: redirect to login if not logged in
    } else {
      setUserData(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AccountContainer>
     

      {/* Main Account Content */}
      <AccountContent>
        <AccountCard>
          <Title>My Account</Title>
          {userData ? (
            <>
              <InfoText><strong>Email:</strong> {userData.email}</InfoText>
              

              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </AccountCard>
      </AccountContent>
    </AccountContainer>
  );
};

export default MyAccount;




