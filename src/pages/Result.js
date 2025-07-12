import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Center,
  Button,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};
  const { translations } = useLanguage();

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.800", "white");
  const headingColorValue = useColorModeValue("blue.500", "blue.300");

  const typeToImage = {
    "egen-boy": "egen-boy.png",
    "egen-girl": "egen-girl.png",
    "teto-boy": "teto-boy.png",
    "teto-girl": "teto-girl.png",
  };
  const imageUrl = result
    ? process.env.PUBLIC_URL + "/images/" + typeToImage[result.type]
    : "";

  if (!result) {
    return (
      <Center minH='100vh'>
        <Box p={8} borderWidth='1px' borderRadius='lg' bg={cardBg}>
          <Text>
            {translations["result.not_found"] ||
              "Could not retrieve results. Please take the survey again."}
          </Text>
          <Button mt={4} onClick={() => navigate("/")}>
            {translations["result.go_home_button"] || "Go to Home"}
          </Button>
        </Box>
      </Center>
    );
  }

  const resultTitleKey = `result.${result.type}-title`;

  return (
    <Center minH='100vh' py={8} flexDirection='column' textAlign='center'>
      <Heading as='h1' size='xl' mb={4} color={headingColor}>
        {translations[resultTitleKey] ||
          translations["result.title"] ||
          "Your Type Is..."}
      </Heading>
      <Box
        p={8}
        maxW='2xl'
        borderWidth='1px'
        borderRadius='lg'
        bg={cardBg}
        boxShadow='xl'
        color={textColor}
      >
        <Image src={imageUrl} alt={translations[resultTitleKey]} mb={6} />
        <Heading as='h2' size='lg' mb={4} color={headingColorValue}>
          {result.type}
        </Heading>
        <Box textAlign='left'>
          <Text fontSize='md' mb={4}>
            <Text as='span' fontWeight='bold' color={labelColor}>
              {translations["result.explanation_label"] || "Explanation:"}
            </Text>
            <span dangerouslySetInnerHTML={{ __html: result.explanation }} />
          </Text>
          <Text fontSize='md' mb={4}>
            <Text as='span' fontWeight='bold' color={labelColor}>
              {translations["result.advice_label"] || "Advice:"}
            </Text>
            <span dangerouslySetInnerHTML={{ __html: result.advice }} />
          </Text>
          <Text fontSize='md'>
            <Text as='span' fontWeight='bold' color={labelColor}>
              {translations["result.love_chain_label"] || "Love Chain:"}
            </Text>
            <span
              dangerouslySetInnerHTML={{ __html: result.love_chain_info }}
            />
          </Text>
        </Box>
      </Box>
      <Button mt={8} colorScheme='green' onClick={() => navigate("/")}>
        {translations["result.go_home_button"] || "Retake Survey"}
      </Button>
    </Center>
  );
};

export default Result;
