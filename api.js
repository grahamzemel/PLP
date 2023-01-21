const express = require('express')
const app = express()
const detectLang = require('lang-detector')

// Sample code snippets in different languages

// const codeSnippets = [
//   { language: 'python', code: "print('Hello, World!')" },
//   { language: 'javascript', code: "console.log('Hello, World!')" },
//   { language: 'c', code: '#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}' },
//   { language: 'c++', code: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}' },
//   { language: 'java', code: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
//   { language: 'ruby', code: 'puts "Hello, World!"' },
//   { language: 'perl', code: 'print "Hello, World!\n"' },
//   { language: 'php', code: '<?php\n  echo "Hello, World!";\n?' }
// ]

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/lang', (req, res) => {
    const code = req.body.code
    const detectionResponse = detectLang(code, { statistics: true })
    const entries = Object.entries(detectionResponse.statistics)
    let totalPoints = 0;
    for (let i = 0; i < entries.length; i++) {
        if (entries[i][1] <= 0) {
            totalPoints += 0
        }
        else {
            totalPoints += entries[i][1]
        }
    }

    const probableLanguages = []
    let highestProbability = 0
    for (const [lang, points] of Object.entries(detectionResponse.statistics)) {
        // calculate probability of iterative language
        const probability = points / totalPoints 
        if (probability > highestProbability) {
            highestProbability = probability
            // console.log("Highest probability is " + highestProbability)
        }

        // console.log("Probability of " + lang + " is " + probability + " :: points: " + points + " total: " + totalPoints)
        
        // prefer the language with the highest probability in the event that it is tied with 'Unknown'
        if (!(lang == 'Unknown' && probability == highestProbability)){
            // high probability determination
            if (probability > 0.66) {
                probableLanguages.push(lang, probability)
            }
            // medium probability determination
            else if (probability > 0.44 && probableLanguages.length <= 3) {
                probableLanguages.push(lang, probability)
            }
            // low probability determination
            else if (probability > 0.22 && probableLanguages.length <= 5) {
                probableLanguages.push(lang, probability)
            }
        }
        // else {
        //     console.log("UNKNOWN TEST FUNCTIONAL")
        // }
        
    } 
    if (probableLanguages.length == 0) {
        probableLanguages.push("Unable to accurately detect language, the code snippet is too short")
    }
    // console.log(probableLanguages)
    // res.send(detectionResponse)
    res.send(probableLanguages)
})

app.get('/', (req, res) => {
  res.send(`
    <form action="/lang" method="post">
      <textarea name="code"></textarea>
      <button type="submit">Detect Language</button>
    </form>
  `)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})