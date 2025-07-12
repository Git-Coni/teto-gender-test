import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Center,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";
import html2canvas from "html2canvas";

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
        const decoded = decodeURIComponent(escape(atob(data)));
        result = JSON.parse(decoded);
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

  const resultTitleKey = result
    ? `result.${result.type}-title`
    : "result.title";

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

  const resultRef = useRef(null);

  const copyText = async () => {
    if (!result) return;
    const textParts = [];
    const title =
      translations[resultTitleKey] ||
      translations["result.title"] ||
      "Your Type";
    const explanationLabel =
      translations["result.explanation_label"] || "Explanation";
    const adviceLabel =
      translations["result.advice_label"] || "Advice";
    const romanceLabel =
      translations["result.romance_label"] || "Romance";
    textParts.push(title);
    textParts.push("\n" + explanationLabel);
    textParts.push(
      formatAndTranslateText(result.explanation, result.type).replace(/<br>/g, "\n")
    );
    textParts.push("\n" + adviceLabel);
    textParts.push(
      formatAndTranslateText(result.advice, result.type).replace(/<br>/g, "\n")
    );
    textParts.push("\n" + romanceLabel);
    textParts.push(
      formatAndTranslateText(result.love_chain_info, result.type).replace(/<br>/g, "\n")
    );
    const text = textParts.join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const saveAsImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "result.png";
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error("Failed to save image", err);
    }
  };

  const saveAsHtml = () => {
    if (!resultRef.current) return;
    const htmlContent = resultRef.current.outerHTML;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "result.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!result) return;
    const titleKey = `result.${result.type}-title`;
    const title =
      translations[titleKey] || translations["result.title"] || "Your Type";
    const json = JSON.stringify(result);
    const encoded = btoa(unescape(encodeURIComponent(json)));
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
      <Stack mt={8} spacing={4} direction='row' justify='center'>
        <Menu>
          <MenuButton as={Button} colorScheme='blue'>
            {translations["result.save_button"] || "Save Result"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={copyText}>
              {translations["result.copy_text"] || "Copy Text"}
            </MenuItem>
            <MenuItem onClick={saveAsImage}>
              {translations["result.save_image"] || "Save as Image"}
            </MenuItem>
            <MenuItem onClick={saveAsHtml}>
              {translations["result.save_html"] || "Save as HTML"}
            </MenuItem>
          </MenuList>
        </Menu>
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

