import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { translations, isLoading } = useLanguage();
  const [selectedGender, setSelectedGender] = useState(null);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColorValue = useColorModeValue("blue.500", "blue.300");

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleStartSurvey = () => {
    if (selectedGender) {
      navigate("/survey", { state: { gender: selectedGender } });
    } else {
      alert(
        translations["home.gender_select_alert"] || "Please select a gender."
      );
    }
  };

  if (isLoading) {
    return (
      <Center minH='100vh'>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <Center>
      <Box
        p={8}
        px={{ base: 4, sm: 8, md: 12 }}
        py={{ base: 8, sm: 12, md: 16 }}
        maxW='lg'
        borderWidth='1px'
        borderRadius='lg'
        bg={cardBg}
        boxShadow='xl'
        textAlign='center'
        color={textColor}
      >
        <Image
          src={`${process.env.PUBLIC_URL}/teto_en.png`}
          alt={translations["home.title"]}
          height='auto'
          width='100%'
          maxW='250px'
          mx='auto'
          mb={4}
          objectFit='contain'
        />
        <Heading as='h1' size='xl' mb={2} color={headingColorValue}>
          {translations["home.title"]}
        </Heading>
        <Text
          fontSize='lg'
          mt={2}
          mb={4}
          fontWeight='bold'
          color={headingColorValue}
        >
          {translations["home.intro_ai_message"]}
        </Text>
        <Text fontSize='md' mb={6}>
          {translations["home.subtitle"]}
        </Text>
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
            {translations["home.male_button"] || "Male"}
          </Button>
          <Button
            onClick={() => handleGenderSelect("female")}
            colorScheme={selectedGender === "female" ? "blue" : "gray"}
            w='50%'
          >
            {translations["home.female_button"] || "Female"}
          </Button>
        </Stack>
        <Button
          onClick={handleStartSurvey}
          colorScheme='green'
          size='lg'
          w='100%'
          disabled={!selectedGender}
        >
          {translations["home.start_button"] || "Start"}
        </Button>
      </Box>
    </Center>
  );
};

export default Home;
