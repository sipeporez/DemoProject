import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../UI/Spinner';
import useLoginCheck from '../Hooks/useLoginCheck';
import CheckEnabled from '../Util/CheckEnabled';

const Sentiment = () => {
    useLoginCheck();
    // 리뷰 결과 상태
    const [result, setResult] = useState('');
    // 로딩 스피너 상태
    const [loading, setLoading] = useState(false);
    // 리뷰 등록시 필요한 input Ref
    const inputData = useRef();
    const timeout = 5000;

    const url = process.env.REACT_APP_FLASK_SERVER + "predict";

    useEffect(()=> {
        CheckEnabled();
    },[])

    // flask 서버 post
    const predictReview = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (inputData.current.value.trim() === "") {
                alert("리뷰를 입력해주세요.")
                return;
            }
            setLoading(true)

            const review = {
                review: inputData.current.value
            }

            inputData.current.value = null;

            await axios.post(url, review, { timeout })
                .then((resp) => {
                    if (resp.data === null) {
                        alert("500자 이내로 입력 해주세요.")
                        setLoading(false)
                        return;
                    }
                    setResult(resp.data)
                    setLoading(false)
                })
                .catch(() => {
                    alert("서버가 응답하지 않습니다.")
                    setLoading(false)
                    return;
                })
        }
    }

    return (
        <div className='flex flex-col justify-center items-center w-full'>
            <div className='flex flex-col my-4 justify-center items-center md:w-2/3 ml-0 lg:ml-32 xl:ml-48'>
                <label className="block m-4 text-2xl font-bold text-gray-200 dark:text-white">네이버 영화 리뷰를 활용한 한국어 감성 분석</label>
                <div className="flex flex-col mb-4 text-md font-medium text-gray-200 dark:text-white">
                    <table>
                        <tbody>
                            <tr>
                                <td>데이터 출처</td>
                                <td>&nbsp;<a target='_blank' rel="noopener noreferrer"
                                    href="https://github.com/e9t/nsmc">
                                    Naver sentiment movie corpus v1.0</a></td>
                            </tr>
                            <tr>
                                <td>사용 모델</td>
                                <td>&nbsp;<a target='_blank' rel="noopener noreferrer"
                                    href="https://scikit-learn.org/1.5/modules/generated/sklearn.linear_model.LogisticRegression.html">
                                    Logistic Regression</a></td>
                            </tr>
                            <tr>
                                <td>토크나이저</td>
                                <td>&nbsp;<a target='_blank' rel="noopener noreferrer"
                                    href="https://konlpy.org/ko/latest/api/konlpy.tag/?highlight=okt#okt-class">
                                    KoNLPy Okt</a></td>
                            </tr>
                            <tr>
                                <td>정확도</td>
                                <td>&nbsp;86.1%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <textarea
                    ref={inputData}
                    rows="2"
                    maxLength={500}
                    className="resize-none p-2.5 w-3/4 text-sm
                        text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="문장을 입력 해주세요.&#13;&#10;Enter 입력시 등록"
                    onKeyDown={(e) => { predictReview(e) }}
                    form='todoInput'>
                </textarea>
                <div className='flex justify-center text-center items-center w-3/4 text-gray-200 mt-4 text-xl'>
                    {loading ? <Spinner width={8} height={8} border={4} /> :
                        result &&
                        <div><span className='flex flex-col mb-4 break-all text-base'>[{result.review}]</span>감성 분석 결과는 {result.review_result === "긍정" ?
                            <span className='text-green-500'>긍정적</span>
                            : <span className='text-red-500'>부정적</span>
                        } 입니다.</div>

                    }
                </div>
            </div>
        </div>
    );
}

export default Sentiment;