import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Stack,
  Button,
  Image,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";

const Home = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleStartSurvey = () => {
    if (selectedGender) {
      navigate("/survey", { state: { gender: selectedGender } });
    } else {
      alert(translations["home.gender_select_alert"]);
    }
  };

  // 라이트 모드와 다크 모드 색상 값 정의
  const boxBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Center minH='100vh' py={8} flexDirection='column' textAlign='center'>
      <Box
        p={8}
        maxW='md'
        borderWidth='1px'
        borderRadius='lg'
        overflow='hidden'
        boxShadow='xl'
        bg={boxBg}
        color={textColor}
        borderColor={borderColor}
      >
        <Heading as='h1' size='xl' mb={4} color={headingColor}>
          {translations["home.title"]}
        </Heading>
        <Text fontSize='md' color={textColor} mb={6}>
          {translations["home.description"]}
        </Text>
        <Image
          src={process.env.PUBLIC_URL + "/teto_en.png"}
          alt='Teto and Egen'
          borderRadius='lg'
          mb={6}
        />
        <Stack
          spacing={4}
          direction='row'
          align='center'
          justify='center'
          mb={6}
        >
          <Button
            onClick={() => handleGenderSelect("male")}
            colorScheme={selectedGender === "male" ? "blue" : "gray"}
            w='50%'
          >
            {translations["home.male_button"]}
          </Button>
          <Button
            onClick={() => handleGenderSelect("female")}
            colorScheme={selectedGender === "female" ? "blue" : "gray"}
            w='50%'
          >
            {translations["home.female_button"]}
          </Button>
        </Stack>
        <Button
          onClick={handleStartSurvey}
          colorScheme='green'
          size='lg'
          w='100%'
          disabled={!selectedGender}
        >
          {translations["home.start_button"]}
        </Button>
      </Box>
    </Center>
  );
};

export default Home;
