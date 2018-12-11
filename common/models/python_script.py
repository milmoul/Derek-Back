# -*- coding: utf-8 -*-

import sys
import json
import spacy
import msgpack

nlp = spacy.load('fr_core_news_sm')
doc = nlp(sys.argv[1])
hubList = sys.argv[2]
data = json.loads(hubList)

for hub in data:
    hub_match_percent = 0
    ratio_list = []
    for question in hub['questionList']:     
        input_lemma = []
        input_list = []
        match_lemma = []
        match_list = []
        intersection = 0
        doc2 = nlp(question['content'])
        for token in doc:
            if(not token.is_stop):
                input_lemma.append(nlp(token.lemma_))
                input_list.append(token.pos_)
        for token in doc2:
            if(not token.is_stop):
                match_lemma.append(nlp(token.lemma_))
                match_list.append(token.pos_)
        """ for lemma1 in input_lemma:
            for lemma2 in match_lemma:
                if(lemma1.similarity(lemma2)>0.95):
                    intersection += 1 """
        ratio_list.append(len(set(input_list).intersection(set(match_list))) / float(len(set(input_list).union(set(match_list)))))
        #print(doc.similarity(doc2))
    if(len(ratio_list)>0):
        hub_match_percent = sum(ratio_list)/float(len(ratio_list))
        print(json.dumps({"hub_id": hub['hub_id'], "hub_match_percent": hub_match_percent}))

sys.stdout.flush()