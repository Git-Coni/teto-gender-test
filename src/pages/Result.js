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

  const formatAndTranslateText = (text, type) => {
    if (!text || !type) return "";

    const allTypes = ["teto-boy", "teto-girl", "egen-boy", "egen-girl"];
    let translatedText = text;

    // 모든 유형 이름에 대해 번역을 수행합니다.
    allTypes.forEach((t) => {
      const translatedTypeName = translations[`result.type.${t}`] || t;
      const regex = new RegExp(t, "g");
      translatedText = translatedText.replace(regex, translatedTypeName);
    });

    // 마지막으로 줄바꿈을 <br> 태그로 변환합니다.
    return translatedText.replace(/\n/g, "<br>");
  };

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
          {translations[resultTitleKey] ||
            translations["result.title"] ||
            "Your Type"}
        </Heading>
        <Box textAlign='left'>
          {/* 설명 섹션 */}
          <Heading
            as='h3'
            size='md'
            mb={2}
            textAlign='center'
            color={labelColor}
          >
            [{translations["result.explanation_label"] || "Explanation"}]
          </Heading>
          <Text fontSize='md' mb={4}>
            <span
              dangerouslySetInnerHTML={{
                __html: formatAndTranslateText(result.explanation, result.type),
              }}
            />
          </Text>

          {/* 조언 섹션 */}
          <Heading
            as='h3'
            size='md'
            mb={2}
            textAlign='center'
            color={labelColor}
          >
            [{translations["result.advice_label"] || "Advice"}]
          </Heading>
          <Text fontSize='md' mb={4}>
            <span
              dangerouslySetInnerHTML={{
                __html: formatAndTranslateText(result.advice, result.type),
              }}
            />
          </Text>

          {/* 연예 섹션 */}
          <Heading
            as='h3'
            size='md'
            mb={2}
            textAlign='center'
            color={labelColor}
          >
            [{translations["result.romance_label"] || "Romance"}]
          </Heading>
          <Text fontSize='md'>
            <span
              dangerouslySetInnerHTML={{
                __html: formatAndTranslateText(
                  result.love_chain_info,
                  result.type
                ),
              }}
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
