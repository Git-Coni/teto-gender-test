import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Center,
  Button,
  useColorModeValue,
  Stack,
  Progress,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useLanguage } from "../utils/LanguageContext";

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [freeTextAnswers, setFreeTextAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { gender } = location.state || {};
  const { translations, lang } = useLanguage();

  const questionCardBg = useColorModeValue("white", "gray.700");
  const questionBoxBg = useColorModeValue("gray.50", "gray.600");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!gender) {
        setError(
          translations["survey.go_home_button"] ||
            "Gender information is missing. Please go back to home."
        );
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://coni.myds.me/api/questions?lang=${lang}`
        );
        if (!response.ok) {
          throw new Error("질문을 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [gender, lang, translations]);

  const handleAnswer = (question, option) => {
    setAnswers({ ...answers, [question]: option });
    if (freeTextAnswers.hasOwnProperty(`${question}_freeText`)) {
      const newFreeTextAnswers = { ...freeTextAnswers };
      delete newFreeTextAnswers[`${question}_freeText`];
      setFreeTextAnswers(newFreeTextAnswers);
    }
  };

  const handleFreeTextAnswer = (question, text) => {
    setFreeTextAnswers({ ...freeTextAnswers, [`${question}_freeText`]: text });
    if (answers.hasOwnProperty(question)) {
      const newAnswers = { ...answers };
      delete newAnswers[`${question}`];
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[`${currentStep}`];
    const hasAnswer =
      answers.hasOwnProperty(currentQuestion?.question) ||
      freeTextAnswers.hasOwnProperty(`${currentQuestion?.question}_freeText`);
    if (currentQuestion && hasAnswer) {
      setCurrentStep(currentStep + 1);
    } else {
      alert(
        translations["survey.submit_button_alert"] ||
          "Please select an option or enter your answer."
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`https://coni.myds.me/api/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender,
          answers: { ...answers, ...freeTextAnswers },
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error("결과 분석에 실패했습니다.");
      }

      const result = await response.json();
      navigate("/result", { state: { result } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 로딩, 에러, 제출 상태에 따라 다른 UI를 반환
  if (loading) {
    return (
      <Center minH='100vh'>
        <Text>{translations["survey.loading"] || "Loading questions..."}</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH='100vh' flexDirection='column'>
        <Text color='red.500'>
          {translations["survey.error"] || "Error:"} {error}
        </Text>
        <Button onClick={() => navigate("/")} mt={4}>
          {translations["survey.go_home_button"] || "Go to Home"}
        </Button>
      </Center>
    );
  }

  if (submitting) {
    return (
      <Center minH='100vh' flexDirection='column'>
        <Spinner
          size='xl'
          thickness='4px'
          speed='0.65s'
          color='blue.500'
          emptyColor='gray.200'
        />
        <Text mt={4} fontSize='xl' fontWeight='bold' textAlign='center'>
          {translations["survey.submitting"] || "Submitting..."}
        </Text>
      </Center>
    );
  }

  const currentQuestion = questions[`${currentStep}`];
  const progressValue = ((currentStep + 1) / questions.length) * 100;
  const surveyTitleKey = `survey.question.${currentStep + 1}.title`;

  let optionsArray = [];
  let isOptionsPresent = false;
  if (currentQuestion && currentQuestion.options) {
    try {
      optionsArray = JSON.parse(currentQuestion.options);
      if (optionsArray.length > 0 && optionsArray[0] !== "") {
        isOptionsPresent = true;
      }
    } catch (e) {
      isOptionsPresent = false;
    }
  }

  return (
    <Center minH='100vh' py={8} flexDirection='column' textAlign='center'>
      <Box
        p={8}
        maxW='md'
        borderWidth='1px'
        borderRadius='lg'
        overflow='hidden'
        boxShadow='xl'
        bg={questionCardBg}
      >
        <Text fontSize='md' mb={6} textAlign='center'>
          {translations[surveyTitleKey] ||
            translations["survey.description"] ||
            "Please answer all questions."}
        </Text>

        {/* 진행 표시기 */}
        <Text mb={2} textAlign='center'>{`${currentStep + 1} / ${
          questions.length
        }`}</Text>
        <Progress value={progressValue} size='sm' mb={6} />

        {currentQuestion ? (
          <Box
            p={4}
            mb={4}
            borderWidth='1px'
            borderRadius='lg'
            bg={questionBoxBg}
          >
            <Text fontWeight='bold' mb={2} textAlign='left' whiteSpace='normal'>
              {currentQuestion.question}
            </Text>
            {isOptionsPresent && (
              <>
                <Stack
                  spacing={2}
                  direction='column'
                  justifyContent='center'
                  mb={4}
                >
                  {optionsArray.map((option, idx) => (
                    <Button
                      key={idx}
                      onClick={() =>
                        handleAnswer(currentQuestion.question, option)
                      }
                      colorScheme={
                        answers[`${currentQuestion.question}`] === option
                          ? "blue"
                          : "gray"
                      }
                      variant={
                        answers[`${currentQuestion.question}`] === option
                          ? "solid"
                          : "outline"
                      }
                      width='100%'
                    >
                      {option}
                    </Button>
                  ))}
                </Stack>
                <Text fontSize='sm' mt={4} mb={2} color='gray.500'>
                  {translations["survey.or_text"] || "or"}
                </Text>
              </>
            )}
            <Input
              placeholder={
                translations["survey.free_text_placeholder"] ||
                "Enter your answer"
              }
              value={
                freeTextAnswers[`${currentQuestion.question}_freeText`] || ""
              }
              onChange={(e) =>
                handleFreeTextAnswer(currentQuestion.question, e.target.value)
              }
            />
          </Box>
        ) : (
          <Text>
            {translations["survey.not_found"] || "No questions found."}
          </Text>
        )}

        <Stack direction='row' spacing={4} mt={6} justifyContent='center'>
          <Button onClick={() => navigate("/")} colorScheme='gray' size='lg'>
            {translations["survey.go_home_button"] || "Go to Home"}
          </Button>
          {currentStep > 0 && (
            <Button onClick={handlePrevious} colorScheme='gray' size='lg'>
              {translations["survey.previous_button"] || "Previous"}
            </Button>
          )}

          {currentStep < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              colorScheme='green'
              size='lg'
              disabled={
                !(
                  answers.hasOwnProperty(currentQuestion?.question) ||
                  freeTextAnswers.hasOwnProperty(
                    `${currentQuestion?.question}_freeText`
                  )
                )
              }
            >
              {translations["survey.next_button"] || "Next"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              colorScheme='green'
              size='lg'
              disabled={
                !(
                  answers.hasOwnProperty(currentQuestion?.question) ||
                  freeTextAnswers.hasOwnProperty(
                    `${currentQuestion?.question}_freeText`
                  )
                )
              }
            >
              {translations["survey.submit_button"] || "View Result"}
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
};

export default Survey;
