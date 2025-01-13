import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LoginState } from '../../Recoil/LoginStateAtom'
import CustomButton from './CustomButton'

export default function NavBar() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    const loginCheck = useRecoilValue(LoginState)
    const setLoginState = useSetRecoilState(LoginState)

    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])

    const navigation = [
        { name: '게시판', href: '/home', current: true, needLogin: false },
        { name: 'To-Do List', href: '/todo', current: false, needLogin: true },
        { name: '감성분석', href: '/senti', current: false, needLogin: true },
        { name: '무한 스크롤', href: '/scroll', current: false, needLogin: false },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // 로그인 상태에 따른 메뉴 표시 설정
    const isLogined = (needLogin) => {
        if (needLogin === false || (needLogin === true && loginCheck)) {
            return true
        }
        else return false
    }

    // 네비바 현재 페이지 음영 처리
    const isCurrentPage = (href) => {
        // '#' href의 경우 현재 경로와 정확히 일치할 때만 active
        if (href === '#') {
            return currentPath === href
        }
        // 그 외의 경우 현재 경로가 href로 시작하는지 확인
        return currentPath.startsWith(href)
    }

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.reload();
    }
    const handleLogin = (e) => {
        window.location.href = '/login';
    }

    return (
        <header className='sticky top-0 w-full z-50 font-Pretendard'>
            <nav>
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        alt=""
                                        src=""
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            isLogined(item.needLogin) ? (
                                                <a key={item.name}
                                                    href={item.href}
                                                    aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                                                    className={
                                                        classNames(
                                                            isCurrentPage(item.href) ? 'bg-gray-900 text-white' :
                                                                'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'rounded-md px-3 py-2 text-md font-medium no-underline')}>{item.name}</a>
                                            ) : null))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* <button type="button"
                                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button> */}
                                {/* 오른쪽 위 프로필 메뉴 */}
                                {loginCheck ?
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    alt=""
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    className="h-8 w-8 rounded-full" />
                                            </MenuButton>
                                        </div>
                                        <MenuItems
                                            transition
                                            className="absolute z-10 right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                            {/* <MenuItem>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                                                    Your Profile
                                                </a>
                                            </MenuItem>
                                            <MenuItem>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                                                    Settings
                                                </a>
                                            </MenuItem> */}
                                            <MenuItem>
                                                <div onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                                                    로그아웃
                                                </div>
                                            </MenuItem>
                                        </MenuItems>
                                    </Menu> :
                                    <CustomButton onClick={handleLogin} label={"로그인"} mb={0} mr={4} />
                                }
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                isLogined(item.needLogin) ? (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                                        className={classNames(
                                            isCurrentPage(item.href) ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium')}>
                                        {item.name}
                                    </DisclosureButton>
                                ) : null))}
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </nav>
        </header>
    )
}