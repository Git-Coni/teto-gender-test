import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Center,
  Button,
  Stack,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result: stateResult } = location.state || {};
  let result = stateResult;
  if (!result) {
    let params = new URLSearchParams(location.search);
    let data = params.get("data");
    // In some hash-routing setups search may be empty, so also check the hash
    if (!data && window.location.hash.includes("?")) {
      params = new URLSearchParams(window.location.hash.split("?")[1]);
      data = params.get("data");
    }
    if (data) {
      try {
        result = JSON.parse(atob(data));
      } catch (err) {
        console.error("Failed to decode shared result", err);
      }
    }
  }
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

    allTypes.forEach((t) => {
      const translatedTypeName = translations[`result.type.${t}`] || t;
      // 'g' (전역) 플래그와 'i' (대소문자 구분 없음) 플래그를 모두 사용합니다.
      const regex = new RegExp(t, "gi");
      translatedText = translatedText.replace(regex, translatedTypeName);
    });

    return translatedText.replace(/\n/g, "<br>");
  };

  const handleSave = () => {
    if (!result) return;
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "result.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!result) return;
    const titleKey = `result.${result.type}-title`;
    const title =
      translations[titleKey] || translations["result.title"] || "Your Type";
    const encoded = btoa(JSON.stringify(result));
    const shareUrl = `${window.location.origin}${window.location.pathname}#/result?data=${encodeURIComponent(encoded)}`;
    const shareData = {
      title,
      text: title,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert(
          translations["result.share_copied"] || "Link copied to clipboard"
        );
      } catch (err) {
        console.error("Clipboard write failed", err);
      }
    }
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
      <Stack
        mt={8}
        spacing={4}
        direction={{ base: "column", md: "row" }}
        justify='center'
      >
        <Button colorScheme='blue' onClick={handleSave}>
          {translations["result.save_button"] || "Save Result"}
        </Button>
        <Button colorScheme='teal' onClick={handleShare}>
          {translations["result.share_button"] || "Share"}
        </Button>
        <Button colorScheme='green' onClick={() => navigate("/")}>
          {translations["result.go_home_button"] || "Retake Survey"}
        </Button>
      </Stack>
    </Center>
  );
};

export default Result;
