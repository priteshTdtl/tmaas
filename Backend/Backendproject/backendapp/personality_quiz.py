class PersonalityQuiz:
    def __init__(self):
        self.questions = {
            "extraversion": [
                "I enjoy social gatherings and meeting new people.",
                "I prefer spending time alone rather than with a large group.",
                "I am outgoing and talkative.",
                "I am reserved and quiet.",
                "I enjoy being the center of attention."
            ],
            "agreeableness": [
                "I am generally compassionate and empathetic.",
                "I prioritize getting my work done over helping others.",
                "I avoid conflicts and arguments.",
                "I am willing to stand up for what I believe, even if it causes conflict.",
                "I am easygoing and forgiving."
            ],
            "openness": [
                "I am curious about the world and enjoy trying new things.",
                "I prefer routine and familiarity over novelty.",
                "I am imaginative and creative.",
                "I stick to traditional ways of doing things.",
                "I am open-minded and embrace new ideas."
            ],
            "conscientiousness": [
                "I am organized and like to have a plan for everything.",
                "I am spontaneous and go with the flow.",
                "I am focused on achieving my goals.",
                "I often procrastinate and leave things until the last minute.",
                "I pay attention to details and strive for perfection."
            ],
            "neuroticism": [
                "I am generally calm and emotionally stable.",
                "I tend to worry a lot about the future.",
                "I am easily stressed and anxious.",
                "I rarely feel sad or depressed.",
                "I am emotionally sensitive and easily get upset."
            ]
        }

        self.personality_traits = {
            "extraversion": 0,
            "agreeableness": 0,
            "openness": 0,
            "conscientiousness": 0,
            "neuroticism": 0
        }

    def take_quiz(self):
        print("Welcome to the Personality Quiz!")
        for trait, trait_questions in self.questions.items():
            print(f"\n{trait.capitalize()}:")
            for question in trait_questions:
                print(question)
                answer = int(input("Choose one: (1: strongly agree, 2: agree, 3: neutral, 4: disagree, 5: strongly disagree) "))
                while answer not in [1, 2, 3, 4, 5]:
                    print("Invalid response. Please choose a number between 1 and 5.")
                    answer = int(input("Choose one: (1: strongly agree, 2: agree, 3: neutral, 4: disagree, 5: strongly disagree) "))
                self.personality_traits[trait] += answer

    def get_personality_result(self):
        print("\nPersonality Result:")
        for trait, score in self.personality_traits.items():
            print(f"{trait.capitalize()}: {score}")